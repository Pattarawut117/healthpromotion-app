'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useLiff } from "@/contexts/LiffContext";
import { motion, AnimatePresence } from "framer-motion";

interface RunSubmissionFormProps {
    campaignId: number;
    activityType: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RunSubmissionForm({ campaignId, activityType, onClose, onSuccess }: RunSubmissionFormProps) {
    const { profile } = useLiff();
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [distance, setDistance] = useState<string>('');
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async () => {
        if (!file || !distance || !profile?.userId) {
            alert("Please fill in all fields and ensure you are logged in.");
            return;
        }

        setUploading(true);
        try {
            // 1. Upload Image
            const formData = new FormData();
            formData.append('file', file);

            const uploadRes = await axios.post('/api/campaign/runUpload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (uploadRes.data.success) {
                const imageUrl = uploadRes.data.path;

                // 2. Submit Run Data
                await axios.post('/api/campaign/runSubmission', {
                    user_id: profile.userId,
                    campaign_id: campaignId,
                    activity_type: activityType,
                    value: parseFloat(distance),
                    pic_url: imageUrl
                });

                alert("ส่งผลวิ่งเรียบร้อยแล้ว! (Run submitted successfully!)");
                onSuccess();
                onClose();
            } else {
                alert("Upload failed: " + uploadRes.data.error);
            }

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
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-cyan-300" />

                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                        🏃‍♂️ ส่งผลการวิ่ง
                    </h3>

                    <div className="space-y-4">
                        {/* Distance Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนก้าว</label>
                            <input
                                type="number"
                                step="1"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                                placeholder="เช่น 5000"
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-center">
                            <input
                                type="file"
                                className="hidden"
                                id="run-file-upload"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="run-file-upload" className="cursor-pointer w-full flex flex-col items-center">
                                {previewUrl ? (
                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-3xl mb-2">📸</span>
                                        <span className="text-sm font-medium text-gray-600">แนบรูปผลการวิ่ง</span>
                                    </>
                                )}
                            </label>
                        </div>

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
                                className="w-full py-2.5 rounded-xl text-white font-semibold bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSubmit}
                                disabled={!file || !distance || uploading}
                            >
                                {uploading ? "กำลังส่ง..." : "ยืนยัน"}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
