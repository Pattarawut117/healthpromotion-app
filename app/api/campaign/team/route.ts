import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const [rows] = await db.query<RowDataPacket[]>(
            `INSERT INTO team (team_name,leader_user_id) VALUES (?, ?)`,
            [body.team_name, body.leader_user_id]
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.log(error);
    }
}