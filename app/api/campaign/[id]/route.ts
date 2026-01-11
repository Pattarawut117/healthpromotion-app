import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const id = params.id;
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT * FROM activities WHERE id = ? `,
            [id]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { message: "Campaign not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
