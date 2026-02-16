'use client';

import { useRef, useState } from "react";
import axios from "axios";
import { compressImage } from "../utils/imageCompression";

export function useBingoUploader() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
        if (!f.type.startsWith("image/")) {
            setError("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
            return;
        }

        // Prevent browser crash from massive files (> 30MB)
        if (f.size > 30 * 1024 * 1024) {
            setError("ไฟล์ต้นฉบับมีขนาดใหญ่เกินไป (เกิน 30MB) กรุณาลดขนาดไฟล์ก่อนเลือก");
            return;
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

            // Convert HEIC + resize
            const safeFile = await compressImage(file);

            // Guard size (10MB max after compress)
            if (safeFile.size > 5 * 1024 * 1024) {
                throw new Error("ไฟล์รูปใหญ่เกิน 5MB");
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
    };
}