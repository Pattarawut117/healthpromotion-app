import { NextResponse } from "next/server";
import { getSupabase } from "@/utils/supabase";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');
    const campaign_id = searchParams.get('campaign_id');
    const activity_type = searchParams.get('activity_type');

    if (!user_id || !campaign_id) {
        return NextResponse.json({ message: "Missing user_id or campaign_id" }, { status: 400 });
    }

    try {
        let query = getSupabase()
            .from('health_logs')
            .select('*')
            .eq('user_id', user_id)
            .eq('campaign_id', campaign_id)
            .order('created_at', { ascending: false });

        if (activity_type) {
            query = query.eq('activity_type', activity_type);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching health logs:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
