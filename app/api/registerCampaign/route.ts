import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface RegisterCampaignRequest {
    user_id: string;
    campaign_id: string;
    activity_name: string;
    activity_type: string;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');
    const campaign_id = searchParams.get('campaign_id');

    if (!user_id || !campaign_id) {
        return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
    }

    try {
        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT * FROM activities_user_register WHERE user_id = ? AND campaign_id = ?",
            [user_id, campaign_id]
        );

        return NextResponse.json({ isRegistered: rows.length > 0 });
    } catch (error) {
        console.error("Error checking registration:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body: RegisterCampaignRequest = await req.json();
        const { user_id, campaign_id, activity_name, activity_type } = body;

        // Check if user already registered for this campaign
        const [existing] = await db.query<RowDataPacket[]>(
            "SELECT * FROM activities_user_register WHERE user_id = ? AND campaign_id = ?",
            [user_id, campaign_id]
        );

        if (existing.length > 0) {
            return NextResponse.json(
                { message: "User already registered for this campaign" },
                { status: 400 }
            );
        }

        const [result] = await db.query(
            "INSERT INTO activities_user_register (user_id, campaign_id, activity_name, activity_type) VALUES (?, ?, ?, ?)",
            [user_id, campaign_id, activity_name, activity_type]
        );

        return NextResponse.json({ message: "Registration successful", result });
    } catch (error) {
        console.error("Error registering for campaign:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}