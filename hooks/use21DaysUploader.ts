import { useRef, useState, useEffect } from "react";
import axios from "axios";

export function use21DaysUploader() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const [error, setError] = useState<string>("");

    // Cleanup preview URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // เมื่อ user เลือกรูป
    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;

        // Validate file type
        if (!f.type.startsWith("image/")) {
            setError("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
            e.target.value = ""; // Reset input
            return;
        }

        // Validate file size (5MB)
        if (f.size > 5 * 1024 * 1024) {
            setError("ขนาดไฟล์ต้องไม่เกิน 5 MB");
            e.target.value = ""; // Reset input
            return;
        }

        setError("");
        setFile(f);
        setPreviewUrl(URL.createObjectURL(f));
    };

    // Upload รูป
    const uploadImage = async () => {
        if (!file) return "";

        try {
            setUploading(true);
            setError("");

            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post("/api/campaign/21daysUpload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (!res.data.success) throw new Error("Upload failed");

            return res.data.path as string;
        } catch (err) {
            console.error("Upload error:", err);
            setError("เกิดข้อผิดพลาดในการอัปโหลด");
            throw err;
        } finally {
            setUploading(false);
        }
    };

    // Reset ทุกอย่าง (STATE + DOM)
    const reset = () => {
        setFile(null);
        setPreviewUrl(null);
        setError("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return {
        file,
        previewUrl,
        uploading,
        setUploading,

        fileInputRef,
        onSelectFile,
        uploadImage,
        reset,
        error
    };
}