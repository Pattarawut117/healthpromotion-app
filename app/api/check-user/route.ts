// app/api/check-user/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { user_id } = await req.json();

  const [rows]: any = await db.query(
    "SELECT user_id FROM users_info WHERE user_id = ?",
    [user_id]
  );

  return NextResponse.json({ exists: rows.length > 0 });
}