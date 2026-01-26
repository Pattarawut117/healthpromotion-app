import { getSupabase } from "@/utils/supabase"
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
    try {
        const { data: rows } = await getSupabase().from('mental_health_assessments').select('*');
        return NextResponse.json(rows);
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { user_id, score } = body
        await getSupabase().from('mental_health_assessments').insert([
            {
                user_id,
                score
            }
        ])
        return NextResponse.json({ message: "Mental health assessment added successfully" })
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

