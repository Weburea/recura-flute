import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getSession } from '@/lib/session';
import { eq } from 'drizzle-orm';

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
    const body = await request.json();
    const { invoiceId, base64Image } = body;

    if (!invoiceId || !base64Image) {
      return NextResponse.json(
        { success: false, error: 'Missing invoiceId or base64Image' },
        { status: 400 }
      );
    }

    // 3. Load Cloudinary Credentials
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'weburea';
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error('[CLOUDINARY UPLOAD ERROR] Cloudinary credentials not configured in env variables');
      return NextResponse.json(
        { success: false, error: 'Cloudinary configuration is missing' },
        { status: 500 }
      );
    }

    // 4. Generate secure signature
    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const folder = `Recure assets/invoices/${session.userId}`;
    
    // Sort parameters to sign alphabetically: folder, timestamp
    const signatureStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');

    // 5. Perform upload to Cloudinary API
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', base64Image);
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
      console.error('[CLOUDINARY UPLOAD ERROR] Cloudinary upload failed:', errorText);
      return NextResponse.json(
        { success: false, error: 'Failed to upload image to Cloudinary' },
        { status: response.status }
      );
    }

    const result = await response.json();
    const secureUrl = result.secure_url;

    // 6. Update target invoice record's metadata in database
    const invoicesList = await db
      .select()
      .from(schema.invoices)
      .where(eq(schema.invoices.id, invoiceId))
      .limit(1);

    if (invoicesList.length > 0) {
      const targetInvoice = invoicesList[0];
      const existingMetadata = (targetInvoice.metadata as Record<string, unknown>) || {};
      
      const updatedMetadata = {
        ...existingMetadata,
        savedImageUrl: secureUrl,
      };

      await db
        .update(schema.invoices)
        .set({ metadata: updatedMetadata })
        .where(eq(schema.invoices.id, invoiceId));
    } else {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      savedImageUrl: secureUrl,
    });
  } catch (err) {
    console.error('Error in POST /api/v1/billing/upload-image:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
