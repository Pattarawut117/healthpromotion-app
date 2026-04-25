import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const rows = await prisma.health_logs.findMany({
            include: {
                user_info: {
                    select: {
                        sname: true
                    }
                }
            }
        });

        // Aggregate values by user_id
        const aggregatedMap = new Map();

        rows?.forEach((row) => {
            const userId = row.user_id;
            const val = parseFloat(row.value) || 0;

            if (aggregatedMap.has(userId)) {
                const existing = aggregatedMap.get(userId);
                existing.value += val;
            } else {
                aggregatedMap.set(userId, { ...row, value: val });
            }
        });

        const aggregatedData = Array.from(aggregatedMap.values());

        return NextResponse.json(aggregatedData);
    } catch (error) {
        console.error("Error submitting bingo:", error);
        return NextResponse.json(
            { error: "Failed to submit bingo" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { user_id, campaign_id, activity_type, value, code_id, pic_url } = body;

        // 2. Insert bingo submission
        await prisma.health_logs.create({
            data: {
                user_id,
                campaign_id,
                code_id,
                activity_type,
                value: value !== undefined ? Number(value) : null,
                pic_url
            }
        });

        return NextResponse.json({ message: "Bingo submission successful" });
    } catch (error) {
        console.error("Error submitting bingo:", error);
        return NextResponse.json(
            { error: "Failed to submit bingo" },
            { status: 500 }
        );
    }
}
