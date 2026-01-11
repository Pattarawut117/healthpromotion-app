'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

interface ICampaign {
    id: number;
    activity_name: string;
    activity_type: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    is_active: string;
    created_at: string;
}

export default function CampaignContent() {
    const params = useParams();
    const contentId = params.content;
    const [campaign, setCampaign] = useState<ICampaign | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (contentId) {
            axios.get(`/api/campaign/${contentId}`)
                .then((response) => {
                    setCampaign(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching campaign details:", error);
                    setLoading(false);
                });
        }
    }, [contentId]);

    if (loading) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    if (!campaign) {
        return <div className="p-4 text-center">Campaign not found</div>;
    }

    return (
        <div className="min-h-screen bg-background p-4">
            <Link href="/campaign">
                <button className="mb-4">
                    Back to Campaigns
                </button>
            </Link>

            <div className="max-w-2xl mx-auto bg-card rounded-lg shadow-lg overflow-hidden">
                <div className="relative w-full h-64">
                    <Image
                        src="/targetForm/exercise.png" // Placeholder image as in CampaignCard
                        alt={campaign.activity_name}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-primary">{campaign.activity_name}</h1>
                        <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                            {campaign.activity_type}
                        </span>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Description</h2>
                        <p className="text-muted-foreground">{campaign.description || "No description available."}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div>
                            <p className="font-semibold">Start Date</p>
                            <p>{new Date(campaign.start_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="font-semibold">End Date</p>
                            <p>{new Date(campaign.end_date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="flex justify-center mt-8">
                        <div className="bg-orange-300 text-primary-foreground rounded-full px-8 py-3 cursor-pointer hover:bg-primary/90 transition-colors duration-300 font-semibold shadow-md">
                            Join Campaign (เข้าร่วม)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
