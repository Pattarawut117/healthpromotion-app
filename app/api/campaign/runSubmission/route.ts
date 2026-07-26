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
        // 1. Fetch run health logs with pagination and selective columns to optimize Vercel/Serverless limits
        let allRows: { user_id?: string; value?: string | number; created_at?: string; code_id?: string; [key: string]: unknown }[] = [];
        let logStart = 0;
        const limit = 1000;

        while (true) {
            const { data, error } = await getSupabase()
                .from('health_logs')
                .select('user_id, value, created_at, code_id')
                .eq('activity_type', 'RUN')
                .range(logStart, logStart + limit - 1);

            if (error) throw error;
            if (!data || data.length === 0) break;

            allRows = allRows.concat(data);
            if (data.length < limit) break;
            logStart += limit;
        }

        // 2. Get registration info with pagination to get target_value and code_id
        let allRegistrations: { user_id?: string; code_id?: string; activities?: unknown; [key: string]: unknown }[] = [];
        let regStart = 0;

        while (true) {
            const { data, error } = await getSupabase()
                .from('activities_user_register')
                .select('user_id, code_id, activities(target_value)')
                .eq('activity_type', 'RUN')
                .range(regStart, regStart + limit - 1);

            if (error) throw error;
            if (!data || data.length === 0) break;

            allRegistrations = allRegistrations.concat(data);
            if (data.length < limit) break;
            regStart += limit;
        }

        const targetMap = new Map();
        const codeMap = new Map();
        allRegistrations.forEach(reg => {
            const target = (reg.activities as Activity)?.target_value;
            targetMap.set(reg.user_id, target);
            if (reg.code_id) {
                codeMap.set(reg.user_id, reg.code_id);
            }
        });

        // Attach target_value and code_id to each row
        const dataWithTarget = allRows.map(row => ({
            ...row,
            target_value: targetMap.get(row.user_id),
            code_id: codeMap.get(row.user_id) || row.code_id
        }));

        return NextResponse.json(dataWithTarget);
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
