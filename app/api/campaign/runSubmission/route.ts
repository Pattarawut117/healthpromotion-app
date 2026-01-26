import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { user_id, campaign_id, activity_type, value, pic_url } = body;


        // 2. Insert bingo submission
        await supabase.from('health_logs').insert([
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
