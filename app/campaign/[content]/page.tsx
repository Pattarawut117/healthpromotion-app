'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useLiff } from "@/contexts/LiffContext";
import { LeftOutlined } from '@ant-design/icons';
import RunSubmissionForm from '@/components/campaign/RunSubmissionForm';
import BingoBoard from '@/components/campaign/bingoBoard/Bingo';
import FloatingActionButton from '@/components/home/FloatingActionButton';
import MentalAssessment from '@/components/campaign/mentalCampaign/MentalAssessment';

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
        } catch (error: unknown) {
            console.error("Registration error:", error);
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert("Failed to register. Please try again.");
            }
        }
    };

    const [showSubmissionForm, setShowSubmissionForm] = useState(false);

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

    const now = new Date();
    const startDate = new Date(campaign.start_date);
    const endDate = new Date(campaign.end_date);
    const isActive = now >= startDate && now <= endDate;

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
                        <div className="flex items-center gap-2">

                            <span className="badge badge-outline">{campaign.activity_type}</span>
                        </div>
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

                    <div className="flex flex-col gap-4 mt-8">
                        <div className="flex justify-end">
                            {isRegistered ? (
                                <div className="badge badge-success p-3 text-white">ลงทะเบียนแล้ว (Registered)</div>
                            ) : (
                                <button
                                    onClick={handleJoin}
                                    className="btn btn-primary"
                                // disabled={campaign.activity_type === "Run"} // Removed disabled logic for Run to allow testing/logic
                                >
                                    เข้าร่วม
                                </button>
                            )}
                        </div>

                        {/* Activities - Only show if active */}
                        {isActive ? (
                            <>
                                {campaign.activity_type === "Run" && (
                                    <div className="mt-4">
                                        <button
                                            className="btn btn-outline btn-info w-full"
                                            onClick={() => setShowSubmissionForm(true)}
                                        >
                                            🏃‍♂️ ส่งผลการวิ่ง (Submit Run)
                                        </button>
                                    </div>
                                )}

                                {campaign.activity_type === "BINGO" && (
                                    <div className="mb-6">
                                        <BingoBoard />
                                        <FloatingActionButton />
                                    </div>
                                )}

                                {campaign.activity_type === "MENTAL" && (
                                    <div className="mb-6">
                                        <MentalAssessment />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="alert alert-warning mt-4">
                                此 Campaign ไม่อยู่ในช่วงเวลาที่กำหนด (This campaign is not active)
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Run Submission Form Modal */}
            {showSubmissionForm && campaign && (
                <RunSubmissionForm
                    campaignId={campaign.id}
                    activityType={campaign.activity_type}
                    onClose={() => setShowSubmissionForm(false)}
                    onSuccess={() => {
                        // Optional: Refresh data or show status
                        console.log("Run submitted");
                    }}
                />
            )}
        </div>
    );
}
