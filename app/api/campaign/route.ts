import { NextResponse } from "next/server";
import { getSupabase } from "@/utils/supabase";

export async function GET() {
    try {
        const { data, error } = await getSupabase()
            .from('activities')
            .select('*');

        if (error) {
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}