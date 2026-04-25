import React from 'react';
import { prisma } from "@/lib/prisma";
import CampaignClient from './CampaignClient';
import { notFound } from 'next/navigation';

export default async function CampaignPage(props: { params: Promise<{ content: string }> }) {
    const params = await props.params;

    let campaignData = null;
    try {
        campaignData = await prisma.activities.findUnique({
            where: {
                id: BigInt(params.content)
            }
        });
    } catch (error) {
        console.error("Error fetching campaign:", error);
    }

    if (!campaignData) {
        return notFound();
    }

    // Map Prisma response to match ICampaign interface in CampaignClient
    const campaign = {
        id: Number(campaignData.id),
        activity_name: campaignData.activity_name,
        activity_type: campaignData.activity_type || "",
        title: campaignData.title || "",
        description: campaignData.description || "",
        start_date: campaignData.start_date ? campaignData.start_date.toISOString() : "",
        end_date: campaignData.end_date ? campaignData.end_date.toISOString() : "",
        is_active: String(campaignData.is_active)
    };

    return <CampaignClient campaign={campaign} />;
}
