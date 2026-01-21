import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { user_id, campaign_id, activity_type, value, pic_url } = body;


        // 2. Insert bingo submission
        await db.query(
            `INSERT INTO health_logs (user_id, campaign_id, activity_type, value, pic_url) VALUES (?, ?, ?, ?, ?)`,
            [user_id, campaign_id, activity_type, value, pic_url]
        );

        return NextResponse.json({ message: "Bingo submission successful" });
    } catch (error) {
        console.error("Error submitting bingo:", error);
        return NextResponse.json(
            { error: "Failed to submit bingo" },
            { status: 500 }
        );
    }
}
