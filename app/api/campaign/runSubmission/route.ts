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
            .select('*, user_info(sname)')
            .eq('activity_type', 'RUN');

        // Get registration info to get target_value
        const { data: registrations } = await getSupabase()
            .from('activities_user_register')
            .select('user_id, activities(target_value)')
            .eq('activity_type', 'RUN');

        const targetMap = new Map();
        registrations?.forEach(reg => {
            const target = (reg.activities as Activity)?.target_value;
            targetMap.set(reg.user_id, target);
        });

        // Attach target_value to each row
        const dataWithTarget = rows?.map(row => ({
            ...row,
            target_value: targetMap.get(row.user_id)
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
        const { user_id, campaign_id, activity_type, value, pic_url } = body;

        // 2. Insert bingo submission
        await getSupabase().from('health_logs').insert([
            {
                user_id,
                campaign_id,
                activity_type,
                value,
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
