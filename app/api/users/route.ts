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
  height?: string;
  weight?: string;
  bmi?: number;
  condentialDisease?: string;
  sleepPerhour?: string;
  sleepEnough?: string;
  isSmoke?: string;
  drinkBeer?: string;
  drinkWater?: string;
  sleepProblem?: string;
  adhd?: string;
  madness?: string;
  bored?: string;
  introvert?: string;
  unit?: string;
  eatVegetable?: string;
  eatSour?: string;
  eatSweetness?: string;
  activitiesTried?: string;
  workingLongtime?: string;
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
      `SELECT user_id, sname, lname, tel, dob, gender, height, weight, bmi, condentialDisease, sleepPerhour, sleepEnough, isSmoke, drinkBeer, drinkWater, sleepProblem, adhd, madness, bored, introvert, unit, eatVegetable, eatSour, eatSweetness, activitiesTried, workingLongtime 
       FROM user_info 
       WHERE user_id = ? 
       LIMIT 1`,
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
      body.bmi ?? null,
      body.condentialDisease ?? null,
      body.sleepPerhour ?? null,
      body.sleepEnough ?? null,
      body.isSmoke ?? null,
      body.drinkBeer ?? null,
      body.drinkWater ?? null,
      body.sleepProblem ?? null,
      body.adhd ?? null,
      body.madness ?? null,
      body.bored ?? null,
      body.introvert ?? null,
      body.unit ?? null,
      body.eatVegetable ?? null,
      body.eatSour ?? null,
      body.eatSweetness ?? null,
      body.activitiesTried ?? null,
      body.workingLongtime ?? null,
    ];

    console.log("Values to be inserted/updated:", values);

    // ✅ Insert ถ้าไม่เคยมี, Update ถ้ามีแล้ว
    await db.execute(
      `INSERT INTO user_info 
        (user_id, sname, lname, tel, dob, gender, height, weight, bmi, condentialDisease, sleepPerhour, sleepEnough, isSmoke, drinkBeer, drinkWater, sleepProblem, adhd, madness, bored, introvert, unit, eatVegetable, eatSour, eatSweetness, activitiesTried, workingLongtime) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        sname = VALUES(sname),
        lname = VALUES(lname),
        tel = VALUES(tel),
        dob = VALUES(dob),
        gender = VALUES(gender),
        height = VALUES(height),
        weight = VALUES(weight),
        bmi = VALUES(bmi),
        condentialDisease = VALUES(condentialDisease),
        sleepPerhour = VALUES(sleepPerhour),
        sleepEnough = VALUES(sleepEnough),
        isSmoke = VALUES(isSmoke),
        drinkBeer = VALUES(drinkBeer),
        drinkWater = VALUES(drinkWater),
        sleepProblem = VALUES(sleepProblem),
        adhd = VALUES(adhd),
        madness = VALUES(madness),
        bored = VALUES(bored),
        introvert = VALUES(introvert),
        unit = VALUES(unit),
        eatVegetable = VALUES(eatVegetable),
        eatSour = VALUES(eatSour),
        eatSweetness = VALUES(eatSweetness),
        activitiesTried = VALUES(activitiesTried),
        workingLongtime = VALUES(workingLongtime)`,
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
