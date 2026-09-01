import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getSession } from '@/lib/session';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const workspaceId = session.activeWorkspaceId;
    if (!workspaceId) {
      return NextResponse.json(
        { success: false, error: 'No active workspace selected' },
        { status: 400 }
      );
    }

    // Verify workspace existence and user ownership
    const workspaces = await db
      .select()
      .from(schema.workspaces)
      .where(eq(schema.workspaces.id, workspaceId))
      .limit(1);

    if (workspaces.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Workspace not found' },
        { status: 404 }
      );
    }

    const workspace = workspaces[0];
    if (workspace.ownerId !== session.userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, industry, email, phone, address, website, logoUrl, registrationNumber, country } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Company Name is required' },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const newMetadata = {
      ...(workspace.metadata || {}),
      email: email.trim(),
      phone: (phone || '').trim(),
      address: (address || '').trim(),
      website: (website || '').trim(),
      logoUrl: (logoUrl || '').trim(),
      registrationNumber: (registrationNumber || '').trim(),
      country: (country || '').trim(),
    };

    await db
      .update(schema.workspaces)
      .set({
        name: name.trim(),
        niche: (industry || '').trim(),
        metadata: newMetadata,
        updatedAt: new Date(),
      })
      .where(eq(schema.workspaces.id, workspace.id));

    return NextResponse.json({
      success: true,
      message: 'Workspace profile updated successfully.',
    });
  } catch (err) {
    console.error('Error in PUT /api/v1/workspaces/profile:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
