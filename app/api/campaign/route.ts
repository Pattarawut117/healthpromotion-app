import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

// กำหนด TypeScript Interface สำหรับข้อมูลผู้ใช้

// กำหนด TypeScript Interface สำหรับข้อมูลผู้ใช้

export async function GET(req: Request) {
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT * FROM activities`
        );
        return NextResponse.json(rows);
    } catch (error) {
        console.log(error);
    }
}


