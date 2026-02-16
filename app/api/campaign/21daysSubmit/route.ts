import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/utils/supabase";

interface Challenge21DaysEntry {
    id: number;
    user_id: string;
    category: string;
    quantity: number;
    duration_minutes: number;
    description: string;
    image_url: string;
    created_at: string;
}

export async function GET() {
    try {
        let allData: Challenge21DaysEntry[] = [];
        let start = 0;
        const limit = 1000;
        const maxRecords = 10000;

        while (allData.length < maxRecords) {
            const { data, error } = await getSupabase()
                .from('challenge_21_days_entries')
                .select('*, user_info(sname)')
                .range(start, start + limit - 1)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (!data || data.length === 0) break;

            allData = allData.concat(data);

            if (data.length < limit) break;

            start += limit;
        }

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

        await getSupabase().from('challenge_21_days_entries').insert([
            {
                user_id,
                category,
                quantity,
                duration_minutes,
                description,
                image_url
            }
        ]);

        return NextResponse.json({ message: "21days submission successful" });
    } catch (error) {
        console.error("Error submitting 21days:", error);
        return NextResponse.json(
            { error: "Failed to submit 21days" },
            { status: 500 }
        );
    }
}
