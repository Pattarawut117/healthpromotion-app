import { NextResponse } from "next/server";
import { getSupabase } from "@/utils/supabase";

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const id = params.id;
    try {
        const { data, error } = await getSupabase()
            .from('activities')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            // Supabase returns 'PGRST116' for no rows found when using .single()
            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    { message: "Campaign not found" },
                    { status: 404 }
                );
            }
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
