import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/utils/supabase";

interface Activity {
    target_value?: number;
    activity_id?: number;
    activity_type?: string;
    campaign_id?: string;
}

export async function GET() {
    try {
        const { data: rows } = await getSupabase()
            .from('health_logs')
            .select('*')
            .eq('activity_type', 'RUN')
            .range(0, 9999);
        //if errror delete .range()

        // Get registration info to get target_value
        const { data: registrations } = await getSupabase()
            .from('activities_user_register')
            .select('user_id, code_id, activities(target_value)')
            .eq('activity_type', 'RUN');

        const targetMap = new Map();
        const codeMap = new Map();
        registrations?.forEach(reg => {
            const target = (reg.activities as Activity)?.target_value;
            targetMap.set(reg.user_id, target);
            if (reg.code_id) {
                codeMap.set(reg.user_id, reg.code_id);
            }
        });

        // Attach target_value and code_id to each row
        const dataWithTarget = rows?.map(row => ({
            ...row,
            target_value: targetMap.get(row.user_id),
            code_id: codeMap.get(row.user_id) || row.code_id
        }));

        return NextResponse.json(dataWithTarget || []);
    } catch (error) {
        console.error("Error fetching run logs:", error);
        return NextResponse.json(
            { error: "Failed to fetch run logs" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { user_id, campaign_id, activity_type, value, code_id, pic_url } = body;

        // 1. Check if user already submitted today (in Asia/Bangkok time)
        const thaiDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' }).format(new Date());

        const { data: recentLogs, error: recentLogsError } = await getSupabase()
            .from('health_logs')
            .select('created_at')
            .eq('user_id', user_id)
            .eq('campaign_id', campaign_id)
            .order('created_at', { ascending: false })
            .limit(1);

        if (recentLogsError) {
            throw recentLogsError;
        }

        if (recentLogs && recentLogs.length > 0) {
            const lastLogDate = recentLogs[0].created_at?.split('T')[0];
            if (lastLogDate === thaiDate) {
                return NextResponse.json(
                    { message: "คุณส่งผลของวันนี้ไปแล้ว กรุณาส่งใหม่ในวันพรุ่งนี้" },
                    { status: 400 }
                );
            }
        }

        // 2. Insert bingo submission
        await getSupabase().from('health_logs').insert([
            {
                user_id,
                campaign_id,
                activity_type,
                value,
                code_id,
                pic_url
            }
        ]);

        return NextResponse.json({ message: "Bingo submission successful" });
    } catch (error) {
        console.error("Error submitting bingo:", error);
        return NextResponse.json(
            { error: "Failed to submit bingo" },
            { status: 500 }
        );
    }
}
