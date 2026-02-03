import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/utils/supabase";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    // 1. หา team ของ user
    const { data: member } = await getSupabase()
        .from("team_members")
        .select("team_id")
        .eq("user_id", user_id)
        .single();

    if (!member) {
        return NextResponse.json({ message: "User not in team" }, { status: 400 });
    }

    const team_id = member.team_id;

    // 2. นับสมาชิกในทีม
    const { count: teamSize } = await getSupabase()
        .from("team_members")
        .select("*", { count: "exact", head: true })
        .eq("team_id", team_id);

    // 3. Get Team Name
    const { data: teamData } = await getSupabase()
        .from("teams")
        .select("team_name")
        .eq("id", team_id)
        .single();

    // 4. นับ submission ต่อ task
    const { data: progress } = await getSupabase().rpc("team_bingo_summary", {
        p_team_id: team_id,
    });

    // 5. Get Team Members with sname
    const { data: membersData } = await getSupabase()
        .from("team_members")
        .select(`
            user_id,
            users_info (
                sname
            )
        `)
        .eq("team_id", team_id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const members = membersData?.map((m: any) => ({
        user_id: m.user_id,
        sname: m.users_info?.sname || "Unknown"
    })) || [];

    return NextResponse.json({
        team_id,
        team_name: teamData?.team_name || "Unknown Team",
        team_size: teamSize,
        members,
        progress,
    });
}