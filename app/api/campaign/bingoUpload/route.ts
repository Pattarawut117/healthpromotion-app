import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/utils/supabase';

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file found' });
        }

        if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
            return NextResponse.json({
                success: false,
                error: "HEIC file not supported"
            }, { status: 415 });
        }

        const clean = file.name.replace(/[^\w.-]/g, "_");
        const filename = `${Date.now()}-${clean || "image.jpg"}}`

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const supabase = getSupabase();
        const { error } = await supabase.storage
            .from('bingo_upload')
            .upload(filename, buffer, {
                contentType: file.type,
                cacheControl: '3600'
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return NextResponse.json({ success: false, error: error.message });
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('bingo_upload')
            .getPublicUrl(filename);

        return NextResponse.json({ success: true, path: publicUrlData.publicUrl });

    } catch (err) {
        console.error("Upload error", err);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}

// try {
//     const { error } = await getSupabase().storage
//         .from('bingo_upload')
//         .upload(filename, file);

//     if (error) {
//         console.error('Supabase upload error:', error);
//         return NextResponse.json({ success: false, error: error.message });
//     }

//     // Get public URL
//     const { data: publicUrlData } = getSupabase().storage
//         .from('bingo_upload')
//         .getPublicUrl(filename);

//     return NextResponse.json({ success: true, path: publicUrlData.publicUrl });

// } catch (error) {
//     console.error('Error uploading file:', error);
//     return NextResponse.json({ success: false, error: 'Error uploading file' });
// }