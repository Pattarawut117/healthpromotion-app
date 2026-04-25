import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RegisterCampaignRequest {
    user_id: string;
    campaign_id: string;
    activity_name: string;
    activity_type: string;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');
    const campaign_id = searchParams.get('campaign_id');
    const activity_type = searchParams.get('activity_type');

    if (!user_id || (!campaign_id && !activity_type)) {
        return NextResponse.json({ message: "Missing parameters" }, { status: 400 });
    }

    try {
        const whereClause: any = { user_id: user_id };

        if (campaign_id) {
            whereClause.campaign_id = Number(campaign_id);
        }

        // If activity_type is provided, check if ANY campaign with this activity_type is registered
        if (activity_type) {
            whereClause.activity_type = activity_type;
        }

        const record = await prisma.activities_user_register.findFirst({
            where: whereClause,
            select: { code_id: true }
        });

        return NextResponse.json({ 
            isRegistered: !!record,
            code_id: record?.code_id || null 
        });
    } catch (error) {
        console.error("Error checking registration:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body: RegisterCampaignRequest = await req.json();
        const { user_id, campaign_id, activity_name, activity_type } = body;

        // 1️⃣ เช็คว่าลงทะเบียนแล้วหรือยัง
        const existingCount = await prisma.activities_user_register.count({
            where: {
                user_id: user_id,
                campaign_id: Number(campaign_id)
            }
        });

        if (existingCount > 0) {
            return NextResponse.json(
                { message: "User already registered for this campaign" },
                { status: 400 }
            );
        }

        let code_id: string | undefined = undefined;

        // -------------------------
        // 2️⃣ สร้างรหัส code_id หากเป็น RUN
        // -------------------------
        if (activity_type === "RUN") {
            const activity = await prisma.activities.findUnique({
                where: { id: Number(campaign_id) },
                select: { target_value: true }
            });

            if (activity && activity.target_value) {
                let prefix = "";
                if (activity.target_value === 300000) {
                    prefix = "3TUH";
                } else if (activity.target_value === 600000) {
                    prefix = "6TUH";
                }

                if (prefix !== "") {
                    const lastRecord = await prisma.activities_user_register.findFirst({
                        where: {
                            code_id: {
                                startsWith: prefix
                            }
                        },
                        orderBy: {
                            code_id: 'desc'
                        },
                        select: {
                            code_id: true
                        }
                    });

                    let nextNumber = 1;
                    if (lastRecord && lastRecord.code_id) {
                        const numberStr = lastRecord.code_id.slice(4);
                        const lastNumber = parseInt(numberStr, 10);
                        if (!isNaN(lastNumber)) {
                            nextNumber = lastNumber + 1;
                        }
                    }

                    if (nextNumber > 9999) {
                        return NextResponse.json(
                            { message: "Registration limit reached for this campaign code." },
                            { status: 400 }
                        );
                    }

                    code_id = `${prefix}${String(nextNumber).padStart(4, '0')}`;
                }
            }
        }

        // -------------------------
        // 3️⃣ บันทึกการสมัครกิจกรรม
        // -------------------------
        await prisma.activities_user_register.create({
            data: {
                user_id,
                campaign_id: Number(campaign_id),
                activity_name,
                activity_type,
                code_id
            }
        });

        return NextResponse.json({ message: "Registration successful", code_id });

    } catch (error) {
        console.error("Error registering for campaign:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}