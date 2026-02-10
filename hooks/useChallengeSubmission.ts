
import { useState } from 'react';
import axios from 'axios';
import { useLiff } from "@/contexts/LiffContext";
import { use21DaysUploader } from "@/hooks/use21DaysUploader";
import Swal from 'sweetalert2';

export function useChallengeSubmission(
    campaignId: number,
    category: 'water' | 'food' | 'sleep' | 'exercise',
    onSuccess: () => void,
    onClose: () => void
) {
    const { profile } = useLiff();
    const [quantity, setQuantity] = useState<string>('');
    const [duration, setDuration] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const { file, previewUrl, uploading, setUploading, fileInputRef, onSelectFile, uploadImage, reset, error: fileError } = use21DaysUploader();

    const isProfileLoaded = !!profile?.userId;

    const handleSubmit = async () => {
        if (!isProfileLoaded) {
            await Swal.fire({
                title: "Loading...",
                text: "กรุณารอสักครู่ (Loading User Profile)",
                icon: "info",
                timer: 1500,
                showConfirmButton: false
            });
            return;
        }

        // Type safe parsing
        const parsedQuantity = quantity ? parseFloat(quantity) : 0;
        const parsedDuration = duration ? parseInt(duration) : 0;

        // Robustness Validation
        if (category === 'water' && (isNaN(parsedQuantity) || parsedQuantity <= 0)) {
            await Swal.fire({
                title: "ข้อมูลไม่ถูกต้อง",
                text: "กรุณาระบุจำนวน (Quantity) ที่ถูกต้อง",
                icon: "warning",
                confirmButtonText: "ตกลง"
            });
            return;
        }
        if (['sleep', 'exercise'].includes(category) && (isNaN(parsedDuration) || parsedDuration <= 0)) {
            await Swal.fire({
                title: "ข้อมูลไม่ถูกต้อง",
                text: "กรุณาระบุระยะเวลา (Duration) ที่ถูกต้อง",
                icon: "warning",
                confirmButtonText: "ตกลง"
            });
            return;
        }

        setUploading(true);
        try {
            let imageUrl = "";

            // Upload Image if exists
            if (file) {
                imageUrl = await uploadImage();
            }

            const payload = {
                user_id: profile.userId,
                campaign_id: campaignId,
                category,
                quantity: parsedQuantity,
                duration_minutes: parsedDuration,
                description,
                image_url: imageUrl
            };

            await axios.post('/api/campaign/21daysSubmit', payload);

            await Swal.fire({
                title: "บันทึกข้อมูลสำเร็จ!",
                text: "Saved Successfully",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });

            reset();
            onSuccess();
            onClose();

        } catch (error: unknown) {
            console.error("Submission error", error);
            const msg = (axios.isAxiosError(error) && error.response?.data?.message) ? error.response.data.message : "เกิดข้อผิดพลาดในการส่งข้อมูล";
            await Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: msg,
                icon: "error",
                confirmButtonText: "ตกลง"
            });
        } finally {
            setUploading(false);
        }
    };

    return {
        // State
        quantity,
        setQuantity,
        duration,
        setDuration,
        description,
        setDescription,
        isProfileLoaded,

        // Uploader
        file,
        previewUrl,
        uploading,
        fileInputRef,
        onSelectFile,
        fileError,

        // Actions
        handleSubmit
    };
}
