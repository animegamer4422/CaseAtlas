import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file found' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads
    // Using a random string for the filename to prevent overwriting
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    // Keep original extension
    const extension = file.name.split('.').pop() || '';
    const newFilename = `${uniqueSuffix}.${extension}`;
    
    const path = join(process.cwd(), 'public', 'uploads', newFilename);
    await writeFile(path, buffer);

    const fileUrl = `/uploads/${newFilename}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
