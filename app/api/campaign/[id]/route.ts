import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const id = params.id;
    try {
        const data = await prisma.activities.findUnique({
            where: {
                id: BigInt(id)
            }
        });

        if (!data) {
            return NextResponse.json(
                { message: "Campaign not found" },
                { status: 404 }
            );
        }

        // Convert BigInt to Number for JSON serialization
        const serializedData = {
            ...data,
            id: Number(data.id)
        };

        return NextResponse.json(serializedData);
    } catch (error) {
        console.error("DB Error (GET /api/campaign/[id]):", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
