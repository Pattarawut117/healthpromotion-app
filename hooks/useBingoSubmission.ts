import { useLiff } from "@/contexts/LiffContext";
import { useBingoUploader } from "@/hooks/useBingoUploader";
import axios from 'axios';
import Swal from 'sweetalert2';

export function useBingoSubmission(
    taskId: number | null,
    onSuccess: () => void,
    onClose: () => void
) {
    const { profile, idToken } = useLiff();
    const {
        file,
        previewUrl,
        uploading,
        setUploading,
        fileInputRef,
        onSelectFile,
        uploadImage,
        reset,
        error: fileError
    } = useBingoUploader();

    const isProfileLoaded = !!profile?.userId;

    const handleSubmit = async () => {
        if (!taskId) return;

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

        if (!file) {
            await Swal.fire({
                title: "กรุณาแนบรูปภาพ",
                text: "ต้องมีรูปภาพเพื่อส่งภารกิจ",
                icon: "warning",
                confirmButtonText: "ตกลง"
            });
            return;
        }

        setUploading(true);
        try {
            // 1. Upload Image
            const imageUrl = await uploadImage();

            // 2. Submit Task
            await axios.post('/api/campaign/bingoSubmissions', {
                task_id: taskId,
                user_id: profile.userId,
                image_url: imageUrl
            }, {
                headers: {
                    'Authorization': `Bearer ${idToken}`
                }
            });

            await Swal.fire({
                title: "ส่งภารกิจเรียบร้อย!",
                text: "Mission Submitted Successfully",
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
        isProfileLoaded,

        // Uploader
        file,
        previewUrl,
        uploading,
        fileInputRef,
        onSelectFile,
        fileError,
        reset,

        // Actions
        handleSubmit
    };
}
