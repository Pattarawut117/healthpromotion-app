import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export const compressVideo = async (
    file: File,
    onProgress?: (progress: number) => void
): Promise<File> => {
    if (!ffmpeg) {
        ffmpeg = new FFmpeg();

        ffmpeg.on('progress', ({ progress }) => {
            if (onProgress) onProgress(Math.round(progress * 100));
        });

        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

        try {
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });
        } catch (error) {
            console.error("FFmpeg Load Error:", error);
            throw new Error("ไม่สามารถโหลดระบบบีบอัดวิดีโอได้");
        }
    }

    const { name } = file;
    const outputName = 'compressed.mp4';

    try {
        await ffmpeg.writeFile(name, await fetchFile(file));

        // Fast compression settings suitable for mobile browsers
        await ffmpeg.exec([
            '-i', name,
            '-vf', 'scale=-2:720', // Scale to 720p height, preserving aspect ratio
            '-c:v', 'libx264',
            '-preset', 'ultrafast',
            '-crf', '28',
            '-c:a', 'aac',
            '-b:a', '128k',
            outputName
        ]);

        const data = await ffmpeg.readFile(outputName);

        // Clean up from memory
        await ffmpeg.deleteFile(name);
        await ffmpeg.deleteFile(outputName);

        const blob = new Blob([new Uint8Array(data as any)], { type: 'video/mp4' });
        const compressedFile = new File([blob], name.replace(/\.[^/.]+$/, "") + "_compressed.mp4", {
            type: 'video/mp4',
            lastModified: Date.now(),
        });

        return compressedFile;
    } catch (error) {
        console.error("Video compression failed", error);
        throw new Error("การบีบอัดวิดีโอล้มเหลว");
    }
};
