import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET() {
    try {
        const { data: rows } = await supabase.from('bingo_activity').select('*');
        return NextResponse.json(rows);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}