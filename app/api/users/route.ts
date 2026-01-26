import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

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

    const { data, error } = await supabase
      .from('user_info')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If no rows found, Supabase returns error with code PGRST116 (sometimes) or just error
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      throw error;
    }

    if (!data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(data);
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

    const userInfo = {
      user_id: body.user_id,
      sname: body.sname ?? null,
      lname: body.lname ?? null,
      tel: body.tel ?? null,
      dob: body.dob ?? null,
      gender: body.gender ?? null,
      height: body.height ?? null,
      weight: body.weight ?? null,
      bmi: body.bmi ?? null,
      condential_disease: body.condentialDisease ?? null,
      sleep_per_hour: body.sleepPerhour ?? null,
      sleep_enough: body.sleepEnough ?? null,
      is_smoking: body.isSmoke ?? null,
      drink_beer: body.drinkBeer ?? null,
      drink_water: body.drinkWater ?? null,
      sleep_problem: body.sleepProblem ?? null,
      adhd: body.adhd ?? null,
      madness: body.madness ?? null,
      bored: body.bored ?? null,
      introvert: body.introvert ?? null,
      unit: body.unit ?? null,
      eat_vegetable: body.eatVegetable ?? null,
      eat_sour: body.eatSour ?? null,
      eat_sweetness: body.eatSweetness ?? null,
      activities_tried: body.activitiesTried ?? null,
      working_longtime: body.workingLongtime ?? null,
    };

    console.log("Values to be inserted/updated:", userInfo);

    // ✅ Insert ถ้าไม่เคยมี, Update ถ้ามีแล้ว (Upsert)
    const { error } = await supabase
      .from('user_info')
      .upsert(userInfo, { onConflict: 'user_id' });

    if (error) {
      throw error;
    }

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
