'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { useLiff } from "@/contexts/LiffContext";
import { LeftOutlined } from '@ant-design/icons';
import RunSubmissionForm from '@/components/campaign/RunSubmissionForm';
// import BingoBoard from '@/components/campaign/bingoBoard/Bingo';
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
    const [isRegisteredForOther, setIsRegisteredForOther] = useState(false);
    const [codeId, setCodeId] = useState<string | null>(null);
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

            const res = await axios.post('/api/registerCampaign', payload);
            Swal.fire({
                title: "Registration successful!",
                text: "ลงทะเบียนสำเร็จ",
                icon: "success",
                confirmButtonText: "ตกลง"
            });
            setIsRegistered(true);
            if (res.data.code_id) {
                setCodeId(res.data.code_id);
            }
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
                    const res = await axios.get(`/api/registerCampaign?user_id=${profile.userId}&activity_type=${campaign.activity_type}&campaign_id=${campaign.id}`);
                    if (res.data.isRegisteredForThisCampaign) {
                        setIsRegistered(true);
                        if (res.data.code_id) {
                            setCodeId(res.data.code_id);
                        }
                    } else if (res.data.isRegisteredForActivityType) {
                        setIsRegisteredForOther(true);
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

        <div className="min-h-screen bg-base-100 relative pb-28">
            {/* Top Navbar */}
            <div className="navbar bg-base-100 sticky top-0 z-50 shadow-sm px-4">
                <div className="navbar-start">
                    <Link href="/campaign" className="btn btn-ghost btn-sm px-2">
                        <LeftOutlined /> กลับ
                    </Link>
                </div>
                <div className="navbar-end">
                    <span className="badge badge-primary badge-outline">{campaign.activity_type}</span>
                </div>
            </div>

            {/* Hero Image Edge-to-Edge */}
            <figure className="w-full aspect-video sm:h-64 relative bg-base-200">
                <img
                    src={campaign.title === 'default_url' ? 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png' : campaign.title}
                    alt={campaign.activity_name}
                    className="w-full h-full object-cover"
                />
            </figure>

            {/* Content Body */}
            <div className="px-5 py-6">
                <h1 className="text-2xl font-bold text-base-content mb-4">{campaign.activity_name}</h1>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2 text-base-content">รายละเอียด</h2>
                    <p className="text-base-content/80 whitespace-pre-wrap">
                        {campaign.description || "ไม่มีรายละเอียดของกิจกรรมในขณะนี้"}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 bg-base-200 p-4 rounded-2xl text-sm">
                    <div>
                        <p className="font-semibold text-base-content/70">เริ่มกิจกรรม</p>
                        <p className="font-medium">{new Date(campaign.start_date).toLocaleDateString('th-TH')}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-base-content/70">สิ้นสุดกิจกรรม</p>
                        <p className="font-medium">{new Date(campaign.end_date).toLocaleDateString('th-TH')}</p>
                    </div>
                </div>

                {codeId && (
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm gap-1 mt-1 mb-1">
                        <span className="text-primary/80 font-medium text-sm">รหัสผู้เข้าร่วมกิจกรรม</span>
                        <span className="font-mono text-3xl font-bold text-primary tracking-widest">{codeId}</span>
                    </div>
                )}

                {!isActive && (
                    <div className="alert alert-warning mt-4 p-3 rounded-xl gap-2 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span>ไม่อยู่ในช่วงเวลาที่กำหนด</span>
                    </div>
                )}
            </div>

            {/* Sticky Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-base-100 border-t border-base-200 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] pt-4 pb-6">
                {isRegistered ? (
                    <div className="flex flex-col gap-3">
                        {/* Status Label */}
                        {
                            isActive ? (<div></div>
                            ) : (<div className="badge badge-error text-white w-full py-3 h-auto font-medium shadow-sm">
                                คุณลงทะเบียนกิจกรรมนี้แล้ว
                            </div>)
                        }

                        {/* Primary Activities */}
                        {isActive && campaign.activity_type === "RUN" && (
                            <button
                                className="btn btn-primary w-full rounded-full shadow-md"
                                onClick={() => setShowSubmissionForm(true)}
                            >
                                🏃‍♂️ ส่งผลการวิ่ง
                            </button>
                        )}
                        {isActive && campaign.activity_type === "HEALTH MISSION" && (
                            <div className="flex justify-center">
                                {/* <BingoBoard /> */}
                                <FloatingActionButton campaignId={campaign.id} />
                            </div>
                        )}
                        {isActive && campaign.activity_type === "MENTAL" && (
                            <div className="w-full">
                                <MentalAssessment />
                            </div>
                        )}
                    </div>
                ) : isRegisteredForOther && campaign.activity_type === "RUN" ? (
                    <div className="flex flex-col gap-2">
                        <div className="alert alert-warning py-3 text-sm rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <span>คุณได้ลงทะเบียนแคมเปญวิ่งอื่นไปแล้ว ไม่สามารถลงทะเบียนซ้ำได้</span>
                        </div>
                        <button
                            className="btn btn-primary w-full rounded-full text-base shadow-md h-12 opacity-50 cursor-not-allowed"
                            disabled
                        >
                            เข้าร่วมกิจกรรม
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleJoin}
                        className="btn btn-primary w-full rounded-full text-base shadow-md h-12"
                        disabled={isActive}
                    >
                        เข้าร่วมกิจกรรม
                    </button>
                )}
            </div>

            {/* Run Submission Form Modal */}
            {
                showSubmissionForm && (
                    <RunSubmissionForm
                        campaignId={campaign.id}
                        activityType={campaign.activity_type}
                        onClose={() => setShowSubmissionForm(false)}
                        onSuccess={() => {
                            console.log("Run submitted");
                        }}
                    />
                )
            }
        </div >
    );
}
