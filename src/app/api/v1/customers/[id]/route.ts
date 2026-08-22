import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getSession } from '@/lib/session';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function extractPublicId(url: string): string | null {
  if (!url.includes('res.cloudinary.com')) return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    
    let publicIdPath = parts[1];
    const versionRegex = /^v\d+\//;
    if (versionRegex.test(publicIdPath)) {
      publicIdPath = publicIdPath.replace(versionRegex, '');
    }
    
    const dotIndex = publicIdPath.lastIndexOf('.');
    if (dotIndex !== -1) {
      publicIdPath = publicIdPath.substring(0, dotIndex);
    }
    
    return decodeURIComponent(publicIdPath);
  } catch (e) {
    console.error('Failed to parse Cloudinary public ID:', e);
    return null;
  }
}

async function deleteCloudinaryAsset(url: string) {
  const publicId = extractPublicId(url);
  if (!publicId) return;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'weburea';
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.warn('[CLOUDINARY] Missing credentials for deleting asset');
    return;
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const signatureStr = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp);
    formData.append('api_key', apiKey);
    formData.append('signature', signature);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;
    const res = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[CLOUDINARY DELETE ERROR] Failed to delete public_id:', publicId, text);
    } else {
      console.log('[CLOUDINARY DELETE SUCCESS] Deleted public_id:', publicId);
    }
  } catch (err) {
    console.error('[CLOUDINARY DELETE EXCEPTION] Error deleting asset:', err);
  }
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    let workspaceId = session.activeWorkspaceId;
    if (!workspaceId) {
      const workspaces = await db
        .select()
        .from(schema.workspaces)
        .where(eq(schema.workspaces.ownerId, session.userId))
        .limit(1);
      if (workspaces.length > 0) {
        workspaceId = workspaces[0].id;
      }
    }

    if (!workspaceId) {
      return NextResponse.json(
        { success: false, error: 'No active workspace found' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, email, status, plan, spent, avatarUrl, currencySymbol } = body;

    // Verify customer exists and belongs to this workspace
    const existing = await db
      .select()
      .from(schema.customers)
      .where(and(eq(schema.customers.id, id), eq(schema.customers.workspaceId, workspaceId)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    const updateData: Partial<typeof schema.customers.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (status !== undefined) updateData.status = status;
    if (plan !== undefined) updateData.plan = plan;
    if (spent !== undefined) updateData.spent = spent;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (currencySymbol !== undefined) updateData.currencySymbol = currencySymbol;

    const oldAvatarUrl = existing[0].avatarUrl;
    if (avatarUrl !== undefined && avatarUrl !== oldAvatarUrl && oldAvatarUrl) {
      deleteCloudinaryAsset(oldAvatarUrl);
    }

    await db
      .update(schema.customers)
      .set(updateData)
      .where(and(eq(schema.customers.id, id), eq(schema.customers.workspaceId, workspaceId)));

    return NextResponse.json({
      success: true,
      data: { id, ...updateData },
    });
  } catch (err) {
    console.error('Error in PATCH /api/v1/customers/[id]:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    let workspaceId = session.activeWorkspaceId;
    if (!workspaceId) {
      const workspaces = await db
        .select()
        .from(schema.workspaces)
        .where(eq(schema.workspaces.ownerId, session.userId))
        .limit(1);
      if (workspaces.length > 0) {
        workspaceId = workspaces[0].id;
      }
    }

    if (!workspaceId) {
      return NextResponse.json(
        { success: false, error: 'No active workspace found' },
        { status: 400 }
      );
    }

    // Verify customer exists and belongs to this workspace before deletion
    const existing = await db
      .select()
      .from(schema.customers)
      .where(and(eq(schema.customers.id, id), eq(schema.customers.workspaceId, workspaceId)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    const avatarUrl = existing[0].avatarUrl;
    if (avatarUrl) {
      deleteCloudinaryAsset(avatarUrl);
    }

    await db
      .delete(schema.customers)
      .where(and(eq(schema.customers.id, id), eq(schema.customers.workspaceId, workspaceId)));

    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (err) {
    console.error('Error in DELETE /api/v1/customers/[id]:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
