import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2"; // ✅ Import RowDataPacket

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();

    // The query returns an array of rows with type RowDataPacket[]
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT user_id FROM user_info WHERE user_id = ?",
      [user_id]
    );

    // Now, you can safely access rows and check the length
    const userExists = rows.length > 0;

    return NextResponse.json({ exists: userExists });
  } catch (error) {
    console.error("Error checking user existence:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}