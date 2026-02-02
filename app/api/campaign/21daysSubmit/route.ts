import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/utils/supabase";

export async function GET(req: NextRequest) {
    try {
        const { data, error } = await getSupabase()
            .from('challenge_21_days_entries')
            .select('*, user_info(sname)');

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching 21days:", error);
        return NextResponse.json(
            { error: "Failed to fetch 21days" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { user_id, category, quantity, duration_minutes, description, image_url } = body;

        await getSupabase().from('challenge_21_days_entries').insert([
            {
                user_id,
                category,
                quantity,
                duration_minutes,
                description,
                image_url
            }
        ]);

        return NextResponse.json({ message: "21days submission successful" });
    } catch (error) {
        console.error("Error submitting 21days:", error);
        return NextResponse.json(
            { error: "Failed to submit 21days" },
            { status: 500 }
        );
    }
}
