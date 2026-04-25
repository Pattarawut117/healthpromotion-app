import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const data = await prisma.activities.findMany();

        // Prisma returns BigInt for `id`, which cannot be directly serialized to JSON
        const serializedData = data.map(activity => ({
            ...activity,
            id: Number(activity.id)
        }));

        return NextResponse.json(serializedData);
    } catch (error) {
        console.error("DB Error (GET /api/campaign):", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}