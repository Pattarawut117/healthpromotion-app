import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false, error: 'No file found' });
    }

    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = join(process.cwd(), 'public', 'run');

        // สร้างโฟลเดอร์หากยังไม่มี
        await mkdir(uploadDir, { recursive: true });

        const filePath = join(uploadDir, filename);
        await writeFile(filePath, buffer);

        // สร้าง Public URL เพื่อให้ฝั่ง Frontend สามารถเข้าถึงและแสดงรูปได้
        const publicUrl = `/run/${filename}`;

        return NextResponse.json({ success: true, path: publicUrl });

    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ success: false, error: 'Error uploading file' });
    }
}
