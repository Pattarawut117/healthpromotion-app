import { db } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
    try {
        const [row] = await db.query(`SELECT * FROM mental_health_assessments`)
        return NextResponse.json(row)
    } catch (error) {
        console.log(error)
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { user_id, score } = body
        await db.query(`INSERT INTO mental_health_assessments (user_id, score) VALUES (?, ?)`, [user_id, score])
        return NextResponse.json({ message: "Mental health assessment added successfully" })
    } catch (error) {
        console.log(error)
    }
}

