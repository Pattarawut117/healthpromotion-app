import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

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
        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT * FROM activities_user_register WHERE user_id = ? AND campaign_id = ?",
            [user_id, campaign_id]
        );

        return NextResponse.json({ isRegistered: rows.length > 0 });
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
        const [existing] = await db.query<RowDataPacket[]>(
            "SELECT * FROM activities_user_register WHERE user_id = ? AND campaign_id = ?",
            [user_id, campaign_id]
        );

        if (existing.length > 0) {
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
            const [teams] = await db.query<RowDataPacket[]>(
                `SELECT id, team_name 
         FROM teams 
         WHERE campaign_id = ?
         ORDER BY id DESC
         LIMIT 1`,
                [campaign_id]
            );

            let teamId: number;
            let teamName: string;

            if (teams.length === 0) {
                // 👉 ยังไม่มีทีม → สร้างทีม 1
                teamName = "Team 1";

                const [result] = await db.query<ResultSetHeader>(
                    `INSERT INTO teams (team_name, leader_user_id, campaign_id)
           VALUES (?, ?, ?)`,
                    [teamName, user_id, campaign_id]
                );

                teamId = result.insertId;
            } else {
                // 👉 มีทีมแล้ว
                const lastTeam = teams[0];

                const [members] = await db.query<RowDataPacket[]>(
                    `SELECT COUNT(*) AS total
           FROM team_members
           WHERE team_id = ?`,
                    [lastTeam.id]
                );

                if (members[0].total < 5) {
                    // ยังไม่ครบ → เข้าทีมเดิม
                    teamId = lastTeam.id;
                    teamName = lastTeam.team_name;
                } else {
                    // ครบแล้ว → สร้างทีมใหม่
                    const nextNumber =
                        parseInt(lastTeam.team_name.replace("Team ", "")) + 1;

                    teamName = `Team ${nextNumber}`;

                    const [result] = await db.query<ResultSetHeader>(
                        `INSERT INTO teams (team_name, leader_user_id, campaign_id)
             VALUES (?, ?, ?)`,
                        [teamName, user_id, campaign_id]
                    );

                    teamId = result.insertId;
                }
            }

            // เพิ่มสมาชิกลงทีม
            await db.query(
                `INSERT INTO team_members (team_id, user_id)
         VALUES (?, ?)`,
                [teamId, user_id]
            );
        }

        // -------------------------
        // 3️⃣ บันทึกการสมัครกิจกรรม
        // -------------------------
        await db.query(
            `INSERT INTO activities_user_register
       (user_id, campaign_id, activity_name, activity_type)
       VALUES (?, ?, ?, ?)`,
            [user_id, campaign_id, activity_name, activity_type]
        );

        return NextResponse.json({ message: "Registration successful" });

    } catch (error) {
        console.error("Error registering for campaign:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}