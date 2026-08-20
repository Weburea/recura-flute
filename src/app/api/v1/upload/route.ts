import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Authorize session
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Parse request data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const nicheParam = formData.get('niche') as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Retrieve niche from either form data, URL query params, or default to 'general'
    const { searchParams } = new URL(request.url);
    const niche = (nicheParam || searchParams.get('niche') || 'general').trim().toLowerCase();

    // 3. Load Cloudinary Credentials
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'weburea';
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error('[UPLOAD ERROR] Cloudinary API key or secret not configured in env variables');
      return NextResponse.json(
        { success: false, error: 'Cloudinary configuration is missing' },
        { status: 500 }
      );
    }

    // 4. Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`;

    // 5. Generate secure signature
    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const folder = `Recure assets/images/${niche}`;
    
    // Sort parameters to sign alphabetically: folder, timestamp
    const signatureStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');

    // 6. Perform upload to Cloudinary API
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', base64Data);
    cloudinaryFormData.append('folder', folder);
    cloudinaryFormData.append('timestamp', timestamp);
    cloudinaryFormData.append('api_key', apiKey);
    cloudinaryFormData.append('signature', signature);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: cloudinaryFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[CLOUDINARY ERROR] Upload failed:', errorText);
      return NextResponse.json(
        { success: false, error: 'Failed to upload to Cloudinary' },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
    });
  } catch (err) {
    console.error('Error in POST /api/v1/upload:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
