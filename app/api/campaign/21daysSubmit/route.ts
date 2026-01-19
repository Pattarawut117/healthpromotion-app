import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { user_id, category, quantity, duration_minutes, description, image_url } = body;

        // Map fields to health_logs schema
        // activity_type = category (e.g. 'water', 'food')
        // value = quantity OR duration_minutes (whichever is non-zero/provided)
        // pic_url = image_url
        // Note: 'description' is currently DROPPED as there is no column for it in the inferred schema.
        // We could append it to activity_type or similar if crucial, but for now we follow schema.

        await db.query(
            `INSERT INTO challenge_21_days_entries (user_id, category, quantity, duration_minutes, description, image_url) VALUES (?, ?, ?, ?, ?, ?)`,
            [user_id, category, quantity, duration_minutes, description, image_url]
        );

        return NextResponse.json({ message: "21days submission successful" });
    } catch (error) {
        console.error("Error submitting 21days:", error);
        return NextResponse.json(
            { error: "Failed to submit 21days" },
            { status: 500 }
        );
    }
}
