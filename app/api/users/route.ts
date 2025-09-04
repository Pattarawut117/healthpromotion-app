import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM user_info");
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("DB Error:", error); // ✅ log ออกไปที่ server
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. ตรวจสอบว่า `body` มีข้อมูลที่จำเป็นหรือไม่
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "No data provided in the request body." }, { status: 400 });
    }

    // 2. สร้าง Array ของค่าที่จะส่งไปยังฐานข้อมูล
    //    โดยจัดการค่าที่อาจเป็น undefined หรือ null ด้วยการใช้ Logical OR (||)
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
    //    ในโค้ดต้นฉบับของคุณมีชื่อตารางเป็น 'users_info' แต่ใน Error Message เป็น 'user_info'
    //    ผมจะใช้ 'user_info' ตามที่ปรากฏใน Error Message
    await db.execute(
      `INSERT INTO user_info 
        (user_id, sname, lname, tel, dob, gender, height, weight, level_activity, exercise_target, water_target) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );

    return NextResponse.json({ message: "Register success" });
  } catch (error: any) {
    console.error("Error during POST request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}