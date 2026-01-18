import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false, error: 'No file found' });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const path = join(process.cwd(), 'public/bingoSubmission', filename);

    try {
        await writeFile(path, buffer);
        console.log(`File saved to ${path}`);

        // Return the path to be stored in the database
        const publicPath = `/bingoSubmission/${filename}`;
        return NextResponse.json({ success: true, path: publicPath });
    } catch (error) {
        console.error('Error saving file:', error);
        return NextResponse.json({ success: false, error: 'Error saving file' });
    }
}
