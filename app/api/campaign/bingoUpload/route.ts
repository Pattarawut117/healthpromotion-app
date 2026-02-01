import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/utils/supabase';

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false, error: 'No file found' });
    }

    const fileExt = file.name.split('.').pop();
    const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${fileExt}`;

    try {
        const { error } = await getSupabase().storage
            .from('bingo_upload')
            .upload(filename, file);

        if (error) {
            console.error('Supabase upload error:', error);
            return NextResponse.json({ success: false, error: error.message });
        }

        // Get public URL
        const { data: publicUrlData } = getSupabase().storage
            .from('bingo_upload')
            .getPublicUrl(filename);

        return NextResponse.json({ success: true, path: publicUrlData.publicUrl });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ success: false, error: 'Error uploading file' });
    }
}
