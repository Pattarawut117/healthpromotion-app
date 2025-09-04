import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// กำหนด TypeScript Interface สำหรับข้อมูลที่คาดว่าจะได้รับจาก req.json()
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

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM user_info");
    return NextResponse.json(rows);
  } catch (error: unknown) {
    console.error("DB Error:", error);
    // ตรวจสอบว่า error เป็น instance ของ Error ก่อนเข้าถึง message
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: UserInfo = await req.json();

    // 1. ตรวจสอบว่า `body` มีข้อมูลที่จำเป็นหรือไม่
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "No data provided in the request body." }, { status: 400 });
    }

    // 2. สร้าง Array ของค่าที่จะส่งไปยังฐานข้อมูล
    const values = [
      body.user_id || null, // ตรวจสอบว่าคุณส่งค่า user_id มาด้วยหรือไม่
      body.sname || null,
      body.lname || null,
      body.tel || null,
      body.dob || null,
      body.gender || null,
      body.height || null,
      body.weight || null,
      body.level_activity || null,
      body.exercise_target || null,
      body.water_target || null,
    ];

    // 3. แสดงข้อมูลที่จะนำไป Insert ลงใน Console เพื่อตรวจสอบ (สำหรับการ Debug)
    console.log("Values to be inserted:", values);

    // 4. สั่ง Insert ข้อมูลลงในฐานข้อมูล
    await db.execute(
      `INSERT INTO user_info 
        (user_id, sname, lname, tel, dob, gender, height, weight, level_activity, exercise_target, water_target) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );

    return NextResponse.json({ message: "Register success" });
  } catch (error: unknown) {
    console.error("Error during POST request:", error);
    // ตรวจสอบว่า error เป็น instance ของ Error ก่อนเข้าถึง message
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
  }
}