'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useLiff } from "@/contexts/LiffContext";
import { LeftOutlined } from '@ant-design/icons';

interface ICampaign {
    id: number;
    activity_name: string;
    activity_type: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    is_active: string;
}

export default function CampaignContent() {
    const { profile } = useLiff();
    const params = useParams();
    const contentId = params.content;
    const [campaign, setCampaign] = useState<ICampaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);

    const handleJoin = async () => {
        if (!campaign || !profile?.userId) {
            alert("Please wait for LINE profile to load or try again.");
            return;
        }

        try {
            const payload = {
                user_id: profile.userId,
                campaign_id: campaign.id,
                activity_name: campaign.activity_name,
                activity_type: campaign.activity_type,
            };

            await axios.post('/api/registerCampaign', payload);
            alert("Registration successful! (ลงทะเบียนสำเร็จ)");
            setIsRegistered(true);
        } catch (error: any) {
            console.error("Registration error:", error);
            if (error.response?.data?.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert("Failed to register. Please try again.");
            }
        }
    };

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

    useEffect(() => {
        const checkRegistration = async () => {
            if (profile?.userId && campaign?.id) {
                try {
                    const res = await axios.get(`/api/registerCampaign?user_id=${profile.userId}&campaign_id=${campaign.id}`);
                    if (res.data.isRegistered) {
                        setIsRegistered(true);
                    }
                } catch (error) {
                    console.error("Error checking registration status:", error);
                }
            }
        };

        checkRegistration();
    }, [profile, campaign]);

    if (loading) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    if (!campaign) {
        return <div className="p-4 text-center">Campaign not found</div>;
    }

    return (
        <div className="min-h-screen bg-base-100">
            <Link href="/campaign">
                <button className="my-2 px-2">
                    <LeftOutlined /> Back to Campaigns
                </button>
            </Link>

            <div className="max-w-2xl mx-auto card bg-base-100 overflow-hidden">
                <figure className="relative w-full h-64">
                    <Image
                        src="/targetForm/exercise.png" // Placeholder image as in CampaignCard
                        alt={campaign.activity_name}
                        fill
                        className="object-cover"
                    />
                </figure>

                <div className="card-body">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="card-title">{campaign.activity_name}</h1>
                        <span className="badge badge-outline">{campaign.activity_type}</span>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">รายละเอียด</h2>
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

                    <div className="flex justify-end mt-8">
                        {isRegistered ? (
                            <div className="badge badge-outline">คุณลงทะเบียนแล้ว</div>
                        ) : (
                            <button
                                onClick={handleJoin}
                                className="btn btn-primary">
                                เข้าร่วม
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
