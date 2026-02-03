'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useLiff } from "@/contexts/LiffContext";
import { LeftOutlined } from '@ant-design/icons';
import RunSubmissionForm from '@/components/campaign/RunSubmissionForm';
import BingoBoard from '@/components/campaign/bingoBoard/Bingo';
import MentalAssessment from '@/components/campaign/mentalCampaign/MentalAssessment';
import FloatingActionButton from '@/components/campaign/bingoBoard/FloatingActionButton';

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

interface CampaignClientProps {
    campaign: ICampaign;
}

export default function CampaignClient({ campaign }: CampaignClientProps) {
    const { profile } = useLiff();
    const [isRegistered, setIsRegistered] = useState(false);
    const [showSubmissionForm, setShowSubmissionForm] = useState(false);

    const handleJoin = async () => {
        if (!campaign || !profile?.userId) {
            Swal.fire({
                title: "Loading...",
                text: "Please wait for LINE profile to load or try again.",
                icon: "info",
                timer: 2000
            });
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
            Swal.fire({
                title: "Registration successful!",
                text: "ลงทะเบียนสำเร็จ",
                icon: "success",
                confirmButtonText: "ตกลง"
            });
            setIsRegistered(true);
        } catch (error: unknown) {
            console.error("Registration error:", error);
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                Swal.fire({
                    title: "Error",
                    text: error.response.data.message,
                    icon: "error"
                });
            } else {
                Swal.fire({
                    title: "Failed",
                    text: "Failed to register. Please try again.",
                    icon: "error"
                });
            }
        }
    };

    useEffect(() => {
        const checkRegistration = async () => {
            if (profile?.userId && campaign?.id) {
                try {
                    const res = await axios.get(`/api/registerCampaign?user_id=${profile.userId}&activity_type=${campaign.activity_type}`);
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
                    <img
                        src={campaign.title === 'default_url' ? 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png' : campaign.title}
                        alt={campaign.activity_name}
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
                                    disabled={!isActive}
                                >
                                    เข้าร่วม
                                    {!isActive && " (Not Active)"}
                                </button>
                            )}
                        </div>

                        {/* Activities - Only show if active */}
                        {isActive && isRegistered ? (
                            <>
                                {campaign.activity_type === "RUN" && (
                                    <div className="mt-4">
                                        <button
                                            className="btn btn-outline btn-info w-full"
                                            onClick={() => setShowSubmissionForm(true)}
                                        >
                                            🏃‍♂️ ส่งผลการวิ่ง (Submit Run)
                                        </button>
                                    </div>
                                )}

                                {campaign.activity_type === "HEALTH MISSION" && (
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
                            !isActive && (
                                <div className="alert alert-warning mt-4">
                                    此 Campaign ไม่อยู่ในช่วงเวลาที่กำหนด (This campaign is not active)
                                </div>
                            )
                        )}

                    </div>
                </div>
            </div>

            {/* Run Submission Form Modal */}
            {showSubmissionForm && (
                <RunSubmissionForm
                    campaignId={campaign.id}
                    activityType={campaign.activity_type}
                    onClose={() => setShowSubmissionForm(false)}
                    onSuccess={() => {
                        console.log("Run submitted");
                    }}
                />
            )}
        </div>
    );
}
