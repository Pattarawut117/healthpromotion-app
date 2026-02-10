import { useRef, useState } from "react";
import axios from "axios";

export function use21DaysUploader() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const [error, setError] = useState<string>("");

    // เมื่อ user เลือกรูป
    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;

        // Validate file size (5MB)
        if (f.size > 10 * 1024 * 1024) {
            setError("ขนาดไฟล์ต้องไม่เกิน 10 MB");
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

        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post("/api/campaign/21daysUpload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        if (!res.data.success) throw new Error("Upload failed");

        return res.data.path as string;
    };

    // Reset ทุกอย่าง (STATE + DOM)
    const reset = () => {
        setFile(null);
        setPreviewUrl(null);

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
