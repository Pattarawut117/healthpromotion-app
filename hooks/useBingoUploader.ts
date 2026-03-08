'use client';

import { useRef, useState } from "react";
import axios from "axios";
import { compressImage } from "../utils/imageCompression";
import { compressVideo } from "../utils/videoCompression";

const checkVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = function () {
            window.URL.revokeObjectURL(video.src);
            resolve(video.duration);
        };
        video.onerror = function () {
            reject(new Error("Cannot load video"));
        };
        video.src = URL.createObjectURL(file);
    });
};

export function useBingoUploader() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [compressionProgress, setCompressionProgress] = useState<number>(0);
    const [isCompressing, setIsCompressing] = useState(false);

    /* ==============================
       1️⃣ Select file (iOS safe)
    ============================== */
    const onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;

        // iOS Safari / LIFF bug: sometimes size = 0
        if (f.size === 0) {
            setError("ไม่สามารถอ่านไฟล์รูปภาพจากอุปกรณ์นี้ได้ กรุณาลองใหม่");
            return;
        }

        // Validate file type
        if (!f.type.startsWith("image/") && !f.type.startsWith("video/")) {
            setError("กรุณาเลือกไฟล์รูปภาพหรือวิดีโอเท่านั้น");
            return;
        }

        if (f.type.startsWith("video/")) {
            // Check video size (15MB max)
            if (f.size > 50 * 1024 * 1024) {
                setError("ไฟล์วิดีโอมีขนาดใหญ่เกินไป (เกิน 50MB)");
                return;
            }

            try {
                const duration = await checkVideoDuration(f);
                if (duration > 20) {
                    setError("วิดีโอมีความยาวเกิน 20 วินาที กรุณาเลือกวิดีโอที่สั้นกว่านี้");
                    return;
                }
            } catch (err) {
                setError("ไม่สามารถตรวจสอบความยาวของวิดีโอได้");
                return;
            }
        } else {
            // Prevent browser crash from massive image files (> 50MB)
            if (f.size > 50 * 1024 * 1024) {
                setError("ไฟล์รูปภาพมีขนาดใหญ่เกินไป (เกิน 50MB) กรุณาลดขนาดไฟล์ก่อนเลือก");
                return;
            }
        }

        setError(null);
        setFile(f);
        setPreviewUrl(URL.createObjectURL(f));
    };

    /* ==============================
       2️⃣ Compress + Convert HEIC → JPG
    ============================== */
    // Moved logic to utils/imageCompression.ts for reusability


    /* ==============================
       3️⃣ Upload to API
    ============================== */
    const uploadImage = async (): Promise<string> => {
        if (!file) throw new Error("No file selected");

        try {
            setUploading(true);

            // If image, Compress & Convert HEIC
            let safeFile = file;
            if (file.type.startsWith("image/")) {
                safeFile = await compressImage(file);
                // Guard size (5MB max after compress)
                if (safeFile.size > 5 * 1024 * 1024) {
                    throw new Error("ไฟล์รูปใหญ่เกิน 5MB");
                }
            } else if (file.type.startsWith("video/")) {
                // Compress Video on the client-side
                setIsCompressing(true);
                safeFile = await compressVideo(file, (progress) => {
                    setCompressionProgress(progress);
                });
                setIsCompressing(false);

                // Guard size for video after compression (e.g. 20MB)
                if (safeFile.size > 20 * 1024 * 1024) {
                    throw new Error("ไฟล์วิดีโอใหญ่เกิน 20MB หลังทำการบีบอัด");
                }
            }

            const formData = new FormData();
            formData.append("file", safeFile);

            const res = await axios.post("/api/campaign/bingoUpload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (!res.data?.success) {
                throw new Error("Upload failed");
            }

            return res.data.path;
        } catch (err: any) {
            console.error("Upload error", err);
            let msg = "เกิดข้อผิดพลาดในการอัปโหลด";

            if (axios.isAxiosError(err)) {
                if (err.response?.status === 413) {
                    msg = "ไฟล์มีขนาดใหญ่เกินกว่าที่เซิร์ฟเวอร์รองรับ (413 Payload Too Large)";
                } else if (err.code === "ERR_NETWORK") {
                    msg = "การเชื่อมต่อขัดข้อง กรุณาตรวจสอบอินเทอร์เน็ต";
                } else if (err.code === "ECONNABORTED") {
                    msg = "การเชื่อมต่อหมดเวลา (Timeout) กรุณาลองใหม่";
                } else if (err.response?.data?.message) {
                    msg = err.response.data.message;
                }
            } else if (err instanceof Error) {
                msg = err.message;
            }

            setError(msg);
            throw err;
        } finally {
            setUploading(false);
        }
    };

    /* ==============================
       4️⃣ Reset input (important for mobile)
    ============================== */
    const reset = () => {
        setFile(null);
        setPreviewUrl(null);
        setError(null);
        setCompressionProgress(0);
        setIsCompressing(false);

        // Critical for iOS / Android browsers
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return {
        file,
        previewUrl,
        uploading,
        error,

        fileInputRef,
        onSelectFile,
        uploadImage,
        reset,
        setUploading,
        compressionProgress,
        isCompressing,
    };
}