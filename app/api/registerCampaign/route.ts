import { NextResponse } from "next/server";
import { getSupabase } from "@/utils/supabase";

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
        let query = getSupabase()
            .from('activities_user_register')
            .select('*')
            .eq('user_id', user_id);

        if (activity_type) {
            query = query.eq('activity_type', activity_type);
        }

        const { data, error } = await query;

        if (error) throw error;

        let isRegisteredForThisCampaign = false;
        let isRegisteredForActivityType = false;
        let code_id = null;

        if (data && data.length > 0) {
            isRegisteredForActivityType = true;

            if (campaign_id) {
                const specificCampaignRecord = data.find(d => d.campaign_id === Number(campaign_id));
                if (specificCampaignRecord) {
                    isRegisteredForThisCampaign = true;
                    code_id = specificCampaignRecord.code_id || null;
                }
            }
        }

        return NextResponse.json({
            isRegisteredForThisCampaign,
            isRegisteredForActivityType,
            code_id
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
        const { data: existing, error: checkError } = await getSupabase()
            .from('activities_user_register')
            .select('*')
            .eq('user_id', user_id)
            .eq('campaign_id', campaign_id);

        if (checkError) throw checkError;

        if (existing && existing.length > 0) {
            return NextResponse.json(
                { message: "User already registered for this campaign" },
                { status: 400 }
            );
        }

        // 1.5️⃣ ถ้าเป็น RUN เช็คว่าเคยลงทะเบียน RUN อันอื่นไปหรือยัง
        if (activity_type === "RUN") {
            const { data: existingRun, error: checkRunError } = await getSupabase()
                .from('activities_user_register')
                .select('*')
                .eq('user_id', user_id)
                .eq('activity_type', 'RUN');

            if (checkRunError) throw checkRunError;

            if (existingRun && existingRun.length > 0) {
                return NextResponse.json(
                    { message: "User already registered for another RUN campaign" },
                    { status: 400 }
                );
            }
        }

        let code_id: string | null = null;

        if (activity_type === "RUN") {
            const { data: activity, error: activityError } = await getSupabase()
                .from('activities')
                .select('target_value')
                .eq('id', Number(campaign_id))
                .maybeSingle();

            if (activityError) throw activityError;

            if (activity && activity.target_value) {
                let prefix = "";
                if (activity.target_value === 300000) {
                    prefix = "3TUH";
                } else if (activity.target_value === 600000) {
                    prefix = "6TUH";
                }

                if (prefix !== "") {
                    const { data: lastRecords, error: lastRecordsError } = await getSupabase()
                        .from('activities_user_register')
                        .select('code_id')
                        .like('code_id', `${prefix}%`)
                        .order('code_id', { ascending: false })
                        .limit(1);

                    if (lastRecordsError) throw lastRecordsError;

                    let nextNumber = 1;
                    if (lastRecords && lastRecords.length > 0 && lastRecords[0].code_id) {
                        const numberStr = lastRecords[0].code_id.slice(4);
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
        const insertData: {
            user_id: string;
            campaign_id: string;
            activity_name: string;
            activity_type: string;
            code_id?: string | null;
        } = {
            user_id,
            campaign_id,
            activity_name,
            activity_type
        };

        if (code_id) {
            insertData.code_id = code_id;
        }

        const { error: registerError } = await getSupabase()
            .from('activities_user_register')
            .insert(insertData);

        if (registerError) throw registerError;

        return NextResponse.json({ message: "Registration successful", code_id });

    } catch (error) {
        console.error("Error registering for campaign:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}