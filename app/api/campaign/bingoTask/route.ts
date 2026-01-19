import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
    try {
        const [row] = await db.query<RowDataPacket[]>(
            "SELECT * FROM bingo_activity"
        );
        return NextResponse.json(row);
    } catch (error) {
        console.log(error);
    }
}