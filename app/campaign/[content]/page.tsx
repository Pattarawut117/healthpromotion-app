import React from 'react';
import { getSupabase } from "@/utils/supabase";
import CampaignClient from './CampaignClient';
import { notFound } from 'next/navigation';

export default async function CampaignPage(props: { params: Promise<{ content: string }> }) {
    const params = await props.params;

    const { data: campaign, error } = await getSupabase()
        .from('activities')
        .select('*')
        .eq('id', params.content)
        .single();

    if (error || !campaign) {
        if (error?.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error("Error fetching campaign:", error);
        }
        return notFound();
    }

    return <CampaignClient campaign={campaign} />;
}
