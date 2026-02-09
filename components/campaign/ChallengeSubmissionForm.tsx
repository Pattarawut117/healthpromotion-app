'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLiff } from "@/contexts/LiffContext";
import { motion, AnimatePresence } from "framer-motion";
import { use21DaysUploader } from "@/hooks/use21DaysUploader";

interface ChallengeSubmissionFormProps {
    category: 'water' | 'food' | 'sleep' | 'exercise';
    onClose: () => void;
    onSuccess: () => void;
}

export default function ChallengeSubmissionForm({ category, onClose, onSuccess }: ChallengeSubmissionFormProps) {
    const { profile } = useLiff();
    const [quantity, setQuantity] = useState<string>('');
    const [duration, setDuration] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [campaignId, setCampaignId] = useState<number | null>(null);
    const { file, previewUrl, uploading, setUploading, fileInputRef, onSelectFile, uploadImage, reset, error: fileError } = use21DaysUploader();

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const res = await axios.get('/api/campaign');
                const campaigns = res.data;
                const target = campaigns.find((c: { activity_type: string; activity_name?: string; id: number }) => c.activity_type === '21Days' || c.activity_name?.includes('21 Days'));
                if (target) {
                    setCampaignId(target.id);
                }
            } catch (err) {
                console.error("Failed to fetch campaign info", err);
            }
        };
        fetchCampaign();
    }, []);

    const getTitle = () => {
        switch (category) {
            case 'water': return '💧 บันทึกการดื่มน้ำ';
            case 'food': return '🍽️ บันทึกการทานอาหาร';
            case 'sleep': return '😴 บันทึกการนอน';
            case 'exercise': return '💪 บันทึกการออกกำลังกาย';
            default: return 'บันทึกข้อมูล';
        }
    };

    const handleSubmit = async () => {
        if (!profile?.userId) {
            alert("กรุณารอสักครู่ (Loading User Profile)");
            return;
        }

        // Basic validation
        if (category === 'water' && !quantity) return alert("Please enter quantity");
        if (category === 'sleep' && !duration) return alert("Please enter duration");

        setUploading(true);
        try {
            let imageUrl = "";

            // Upload Image if exists
            if (file) {
                imageUrl = await uploadImage();
            }

            const finalCampaignId = campaignId || 0;

            const payload = {
                user_id: profile.userId,
                campaign_id: finalCampaignId,
                category,
                quantity: quantity ? parseFloat(quantity) : 0,
                duration_minutes: duration ? parseInt(duration) : 0,
                description,
                image_url: imageUrl
            };

            await axios.post('/api/campaign/21daysSubmit', payload);

            alert("บันทึกข้อมูลเรียบร้อย! (Saved Successfully)");
            reset();
            onSuccess();
            onClose();

        } catch (error: unknown) {
            console.error("Submission error", error);
            const msg = (axios.isAxiosError(error) && error.response?.data?.message) ? error.response.data.message : "เกิดข้อผิดพลาดในการส่งข้อมูล";
            alert(msg);
        } finally {
            setUploading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-teal-300" />

                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                        {getTitle()}
                    </h3>

                    <div className="space-y-4">

                        {/* INPUTS based on Category */}

                        {category === 'water' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">จำนวน (แก้ว)</label>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                    placeholder="โปรดใส่เฉพาะตัวเลข ex. 2"
                                />
                            </div>
                        )}

                        {category === 'sleep' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ระยะเวลา (ชั่วโมง)</label>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                                    placeholder="โปรดใส่เฉพาะตัวเลข ex. 8"
                                />
                            </div>
                        )}

                        {category === 'exercise' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ระยะเวลา (นาที)</label>
                                <p className="text-sm text-red">*ออกกำลังกายอย่างน้อย 30 นาที</p>
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
                                    placeholder="โปรดใส่เฉพาะตัวเลข ex. 30"
                                    min="30"
                                />
                            </div>
                        )}

                        {/* Description - Common for all except water maybe? but good to have */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดเพิ่มเติม (Optional)</label>
                            <div className='relative'>
                                <textarea
                                    value={description}
                                    maxLength={30}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none text-sm"
                                    rows={2}
                                    placeholder="บรรยายกิจกรรม (สูงสุด 30 ตัวอักษร)"
                                />
                                <div className="text-right text-xs text-black mt-1">
                                    {description.length}/30
                                </div>
                            </div>
                        </div>

                        {/* Image Upload - Focus for Food, optional for others */}
                        <div className="p-3 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-center">
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                id="challenge-file-upload"
                                accept="image/*"
                                onChange={onSelectFile}
                            />
                            <label htmlFor="challenge-file-upload" className="cursor-pointer w-full flex flex-col items-center">
                                {previewUrl ? (
                                    <div className="relative w-full h-32 rounded-lg overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-2xl mb-1">📸</span>
                                        <span className="text-xs font-medium text-gray-600">
                                            {category === 'food' ? "ทานอาหารแบบ 2:1:1" : "แนบรูป (ถ้ามี)"}
                                        </span>
                                    </>
                                )}
                            </label>
                        </div>
                        {fileError && <p className="text-red-500 text-xs mt-1 text-center">{fileError}</p>}

                        {/* Buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                className="w-full py-2.5 rounded-xl text-gray-600 font-semibold bg-gray-100 hover:bg-gray-200 transition-colors"
                                onClick={onClose}
                                disabled={uploading}
                            >
                                ยกเลิก
                            </button>
                            <button
                                className="w-full py-2.5 rounded-xl text-white font-semibold bg-green-500 hover:bg-green-600 shadow-lg shadow-green-200 transition-colors disabled:opacity-50"
                                onClick={handleSubmit}
                                disabled={uploading || (category === 'water' && !quantity) || (category === 'sleep' && !duration)}
                            >
                                {uploading ? "กำลังบันทึก..." : "ยืนยัน"}
                            </button>
                        </div>

                    </div>
                    {/* Warn if campaign not found? */}
                    {!campaignId && <p className="text-[10px] text-red-400 text-center mt-2">Warning: Campaign &apos;21 Days&apos; not found automatically.</p>}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
