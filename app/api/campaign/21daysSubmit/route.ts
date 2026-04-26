import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const allData = await prisma.challenge21DaysEntries.findMany({
            take: 10000,
            include: {
                user_info: {
                    select: {
                        sname: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(allData);
    } catch (error) {
        console.error("Error fetching 21days:", error);
        return NextResponse.json(
            { error: "Failed to fetch 21days" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { user_id, category, quantity, duration_minutes, description, image_url } = body;

        await prisma.challenge21DaysEntries.create({
            data: {
                user_id,
                category,
                quantity,
                durationMinutes: duration_minutes,
                description,
                image_url
            }
        });

        return NextResponse.json({ message: "21days submission successful" });
    } catch (error) {
        console.error("Error submitting 21days:", error);
        return NextResponse.json(
            { error: "Failed to submit 21days" },
            { status: 500 }
        );
    }
}
