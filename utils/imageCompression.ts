/**
 * Compresses an image file by resizing and reducing quality.
 * Converts to JPEG format.
 * 
 * @param file - The original image file
 * @param maxWidth - Maximum width of the compressed image (default: 1280px)
 * @param quality - JPEG quality between 0 and 1 (default: 0.75)
 * @returns Promise<File> - The compressed file
 */
export const compressImage = async (
    file: File,
    maxWidth: number = 1280,
    quality: number = 0.75
): Promise<File> => {
    // 1. Create bitmap from file (efficient & handles some orientation cases)
    let image: ImageBitmap;
    try {
        image = await createImageBitmap(file);
    } catch (error) {
        console.error("createImageBitmap failed:", error);
        throw new Error("ไฟล์รูปภาพเสียหายหรือไม่รองรับรูปแบบนี้");
    }

    // 2. Calculate new dimensions
    const scale = Math.min(1, maxWidth / image.width);
    const width = Math.round(image.width * scale);
    const height = Math.round(image.height * scale);

    // 3. Draw to canvas
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        image.close();
        throw new Error("Could not get canvas context");
    }

    ctx.drawImage(image, 0, 0, width, height);
    image.close(); // Release memory used by bitmap

    // 4. Convert canvas to Blob/File
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("Image compression failed"));
                    return;
                }

                // Construct new filename with .jpg extension
                const fileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";

                const compressedFile = new File([blob], fileName, {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                });

                resolve(compressedFile);
            },
            "image/jpeg",
            quality
        );
    });
};
