import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface BingoSubmissionRequest {
    task_id: string;
    team_id: string;
    user_id: string;
    image_url: string;
}

export async function POST(req: Request) {
    try {
        const body: BingoSubmissionRequest = await req.json();
        const { task_id, user_id, image_url } = body;

        // 1. หา team_id จาก user_id
        const [teamRows] = await db.query<RowDataPacket[]>(
            `SELECT team_id 
       FROM team_members 
       WHERE user_id = ?
       LIMIT 1`,
            [user_id]
        );

        if (teamRows.length === 0) {
            return NextResponse.json(
                { message: "User is not in any team" },
                { status: 400 }
            );
        }

        const team_id = teamRows[0].team_id; // ✅ เป็น INT แน่นอน

        // 2. Insert bingo submission
        await db.query(
            `INSERT INTO bingo_submissions 
       (task_id, team_id, user_id, image_url)
       VALUES (?, ?, ?, ?)`,
            [task_id, team_id, user_id, image_url]
        );

        return NextResponse.json({ message: "Bingo submitted successfully" });

    } catch (error) {
        console.error("Error submitting bingo:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}