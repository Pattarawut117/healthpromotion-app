import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file" }, { status: 400 });
        }

        // 🚨 Reject HEIC (iOS)
        if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
            return NextResponse.json({
                success: false,
                error: "iPhone HEIC not supported, please convert"
            }, { status: 415 });
        }

        // Convert Web File → Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Sanitize filename
        const clean = file.name.replace(/[^\w.-]/g, "_");
        const filename = `${Date.now()}-${clean || "image.jpg"}`;

        // Create directory if not exists
        const uploadDir = path.join(process.cwd(), "public", "21challenge");
        await mkdir(uploadDir, { recursive: true });

        // Save file locally
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        // Return the public URL path
        return NextResponse.json({
            success: true,
            path: `/21challenge/${filename}`,
        });
    } catch (err) {
        console.error("Upload crashed:", err);
        return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
    }
}