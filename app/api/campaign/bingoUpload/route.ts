import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false, error: 'No file found' });
    }

    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;

    try {
        const { data: uploadData, error } = await supabase.storage
            .from('bingo_upload')
            .upload(filename, file);

        if (error) {
            console.error('Supabase upload error:', error);
            return NextResponse.json({ success: false, error: error.message });
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('bingo_upload')
            .getPublicUrl(filename);

        return NextResponse.json({ success: true, path: publicUrlData.publicUrl });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ success: false, error: 'Error uploading file' });
    }
}
