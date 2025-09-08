import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

// กำหนด TypeScript Interface สำหรับข้อมูลผู้ใช้
interface UserInfo {
  user_id: string;
  sname?: string;
  lname?: string;
  tel?: string;
  dob?: string;
  gender?: string;
  height?: number;
  weight?: number;
  level_activity?: string;
  exercise_target?: number;
  water_target?: number;
}

// ✅ GET /api/users?user_id=xxx
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT user_id, sname, lname FROM user_info WHERE user_id = ? LIMIT 1",
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error: unknown) {
    console.error("DB Error (GET):", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// ✅ POST /api/users (Insert or Update user info)
export async function POST(req: Request) {
  try {
    const body: UserInfo = await req.json();

    if (!body?.user_id) {
      return NextResponse.json(
        { error: "user_id is required in request body" },
        { status: 400 }
      );
    }

    const values = [
      body.user_id,
      body.sname ?? null,
      body.lname ?? null,
      body.tel ?? null,
      body.dob ?? null,
      body.gender ?? null,
      body.height ?? null,
      body.weight ?? null,
      body.level_activity ?? null,
      body.exercise_target ?? null,
      body.water_target ?? null,
    ];

    console.log("Values to be inserted/updated:", values);

    // ✅ Insert ถ้าไม่เคยมี, Update ถ้ามีแล้ว
    await db.execute(
      `INSERT INTO user_info 
        (user_id, sname, lname, tel, dob, gender, height, weight, level_activity, exercise_target, water_target) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        sname = VALUES(sname),
        lname = VALUES(lname),
        tel = VALUES(tel),
        dob = VALUES(dob),
        gender = VALUES(gender),
        height = VALUES(height),
        weight = VALUES(weight),
        level_activity = VALUES(level_activity),
        exercise_target = VALUES(exercise_target),
        water_target = VALUES(water_target)`,
      values
    );

    return NextResponse.json({
      message: "Register success",
      mode: "insert_or_update",
    });
  } catch (error: unknown) {
    console.error("DB Error (POST):", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}