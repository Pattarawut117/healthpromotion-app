import { getSupabase } from "@/utils/supabase"
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("user_id");

        let query = getSupabase().from('mental_health_assessments').select('*');
        if (userId) {
            query = query.eq('user_id', userId).order('created_at', { ascending: false });
        }

        const { data: rows, error } = await query;
        if (error) {
            console.error("Supabase GET Error:", error);
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
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
        const { user_id, depress, anxiety, stress } = body
        const { error } = await getSupabase().from('mental_health_assessments').insert([
            {
                user_id,
                depress,
                anxiety,
                stress
            }
        ]);

        if (error) {
            console.error("Supabase Insert Error:", error);
            return NextResponse.json({ message: error.message, details: error }, { status: 500 });
        }

        return NextResponse.json({ message: "Mental health assessment added successfully" })
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

