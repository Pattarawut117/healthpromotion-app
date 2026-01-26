import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

interface RegisterCampaignRequest {
    user_id: string;
    campaign_id: string;
    activity_name: string;
    activity_type: string;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');
    const campaign_id = searchParams.get('campaign_id');

    if (!user_id || !campaign_id) {
        return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from('activities_user_register')
            .select('*')
            .eq('user_id', user_id)
            .eq('campaign_id', campaign_id);

        if (error) throw error;

        return NextResponse.json({ isRegistered: data.length > 0 });
    } catch (error) {
        console.error("Error checking registration:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body: RegisterCampaignRequest = await req.json();
        const { user_id, campaign_id, activity_name, activity_type } = body;

        // 1️⃣ เช็คว่าลงทะเบียนแล้วหรือยัง
        const { data: existing, error: checkError } = await supabase
            .from('activities_user_register')
            .select('*')
            .eq('user_id', user_id)
            .eq('campaign_id', campaign_id);

        if (checkError) throw checkError;

        if (existing && existing.length > 0) {
            return NextResponse.json(
                { message: "User already registered for this campaign" },
                { status: 400 }
            );
        }

        // -------------------------
        // 2️⃣ ถ้าเป็น BINGO
        // -------------------------
        if (activity_type === "BINGO") {

            // หา team ล่าสุด
            const { data: teams, error: teamError } = await supabase
                .from('teams')
                .select('id, team_name')
                .eq('campaign_id', campaign_id)
                .order('id', { ascending: false })
                .limit(1);

            if (teamError) throw teamError;

            let teamId: number;
            let teamName: string;

            if (!teams || teams.length === 0) {
                // 👉 ยังไม่มีทีม → สร้างทีม 1
                teamName = "Team 1";

                const { data: newTeam, error: createTeamError } = await supabase
                    .from('teams')
                    .insert({ team_name: teamName, leader_user_id: user_id, campaign_id: campaign_id })
                    .select('id')
                    .single();

                if (createTeamError) throw createTeamError;
                teamId = newTeam.id;

            } else {
                // 👉 มีทีมแล้ว
                const lastTeam = teams[0];

                const { count, error: countError } = await supabase
                    .from('team_members')
                    .select('*', { count: 'exact', head: true })
                    .eq('team_id', lastTeam.id);

                if (countError) throw countError;

                // count is possibly null if error, but here unlikely
                const memberCount = count || 0;

                if (memberCount < 5) {
                    // ยังไม่ครบ → เข้าทีมเดิม
                    teamId = lastTeam.id;
                    teamName = lastTeam.team_name;
                } else {
                    // ครบแล้ว → สร้างทีมใหม่
                    const nextNumber =
                        parseInt(lastTeam.team_name.replace("Team ", "")) + 1;

                    teamName = `Team ${nextNumber}`;

                    const { data: newTeam, error: createTeamError } = await supabase
                        .from('teams')
                        .insert({ team_name: teamName, leader_user_id: user_id, campaign_id: campaign_id })
                        .select('id')
                        .single();

                    if (createTeamError) throw createTeamError;
                    teamId = newTeam.id;
                }
            }

            // เพิ่มสมาชิกลงทีม
            const { error: addMemberError } = await supabase
                .from('team_members')
                .insert({ team_id: teamId, user_id: user_id });

            if (addMemberError) throw addMemberError;
        }

        // -------------------------
        // 3️⃣ บันทึกการสมัครกิจกรรม
        // -------------------------
        const { error: registerError } = await supabase
            .from('activities_user_register')
            .insert({
                user_id,
                campaign_id,
                activity_name,
                activity_type
            });

        if (registerError) throw registerError;

        return NextResponse.json({ message: "Registration successful" });

    } catch (error) {
        console.error("Error registering for campaign:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}