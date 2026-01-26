import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { data: rows } = await supabase.from('team').insert([
            {
                team_name: body.team_name,
                leader_user_id: body.leader_user_id
            }
        ]);
        return NextResponse.json(rows);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}