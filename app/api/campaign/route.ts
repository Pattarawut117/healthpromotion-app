import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT * FROM activities`
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.log(error);
    }
}