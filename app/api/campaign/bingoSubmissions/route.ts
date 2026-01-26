import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

interface BingoSubmissionRequest {
    task_id: string;
    team_id: string;
    user_id: string;
    image_url: string;
    status: string;
}

export async function GET() {
    try {
        const { data: rows, error } = await supabase
            .from('bingo_submissions')
            .select('*');

        if (error) {
            throw error;
        }

        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error fetching bingo submissions:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body: BingoSubmissionRequest = await req.json();
        const { task_id, user_id, image_url } = body;

        // 1. Find team_id from user_id
        const { data: teamData, error: teamError } = await supabase
            .from('team_members')
            .select('team_id')
            .eq('user_id', user_id)
            .single();

        if (teamError || !teamData) {
            // Supabase returns 'PGRST116' for no rows found when using .single()
            if (teamError && teamError.code === 'PGRST116') {
                return NextResponse.json(
                    { message: "User is not in any team" },
                    { status: 400 }
                );
            }

            // If it's another error or just no data (though .single() usually throws or errors on no data)
            console.error("Error finding team:", teamError);
            return NextResponse.json(
                { message: "User is not in any team" },
                { status: 400 }
            );
        }

        const team_id = teamData.team_id;

        // 2. Insert bingo submission
        const { error: insertError } = await supabase
            .from('bingo_submissions')
            .insert([
                {
                    task_id,
                    team_id,
                    user_id,
                    image_url
                }
            ]);

        if (insertError) {
            throw insertError;
        }

        return NextResponse.json({ message: "Bingo submitted successfully" });

    } catch (error) {
        console.error("Error submitting bingo:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}