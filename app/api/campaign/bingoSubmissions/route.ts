import { NextResponse } from "next/server";
import { getSupabase } from "@/utils/supabase";
import { verifyLineToken } from "@/utils/auth";

interface BingoSubmissionRequest {
    task_id: string;
    team_id: string;
    user_id: string;
    image_url: string;
    status: string;
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const team_id = searchParams.get('team_id');
        const user_id = searchParams.get('user_id');

        let query = getSupabase()
            .from('bingo_submissions')
            .select('*');

        if (team_id) {
            query = query.eq('team_id', team_id);
        }

        if (user_id) {
            query = query.eq('user_id', user_id);
        }

        const { data: rows, error } = await query;

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
        // 0. Verify ID Token
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: "Missing or invalid token" }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const verifiedUserId = await verifyLineToken(token);

        if (!verifiedUserId) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
        }

        const body: BingoSubmissionRequest = await req.json();
        const { task_id, image_url } = body; // removed user_id from body destructuring to avoid confusion

        // Use verifiedUserId instead of body.user_id
        const user_id = verifiedUserId;

        // 1. Find team_id from user_id
        const { data: teamData, error: teamError } = await getSupabase()
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
        const { error: insertError } = await getSupabase()
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