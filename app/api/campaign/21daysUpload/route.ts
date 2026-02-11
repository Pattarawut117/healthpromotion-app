import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/utils/supabase";

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

        const supabase = getSupabase();

        const { error } = await supabase.storage
            .from("21days_challenge")
            .upload(filename, buffer, {
                contentType: file.type || "image/jpeg",
                cacheControl: "3600",
                upsert: false,
            });

        if (error) {
            console.error("Supabase upload error:", error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        const { data } = supabase.storage
            .from("21days_challenge")
            .getPublicUrl(filename);

        return NextResponse.json({
            success: true,
            path: data.publicUrl,
        });
    } catch (err) {
        console.error("Upload crashed:", err);
        return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
    }
}