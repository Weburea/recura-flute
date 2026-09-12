import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getSession } from '@/lib/session';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { targetEmail, confirmWorkspaceName } = body;

    if (!targetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
      return NextResponse.json({ success: false, error: 'Valid recipient email address is required.' }, { status: 400 });
    }

    // Fetch caller's profile
    const profiles = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.id, session.userId))
      .limit(1);

    if (profiles.length === 0) {
      return NextResponse.json({ success: false, error: 'Profile not found.' }, { status: 404 });
    }

    const currentProfile = profiles[0];

    // Find the workspace owned by this user
    const userWorkspaces = await db
      .select()
      .from(schema.workspaces)
      .where(eq(schema.workspaces.ownerId, session.userId))
      .limit(1);

    if (userWorkspaces.length === 0) {
      return NextResponse.json({ success: false, error: 'You must be the primary workspace owner to transfer ownership.' }, { status: 403 });
    }

    const currentWorkspace = userWorkspaces[0];

    // Validate confirmation workspace name
    if (confirmWorkspaceName?.trim().toLowerCase() !== currentWorkspace.name.trim().toLowerCase()) {
      return NextResponse.json({ 
        success: false, 
        error: `Confirmation failed: Workspace name '${confirmWorkspaceName}' does not match '${currentWorkspace.name}'.` 
      }, { status: 400 });
    }

    // Check if target user exists in database
    const targetProfiles = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.email, targetEmail.trim().toLowerCase()))
      .limit(1);

    if (targetProfiles.length > 0) {
      // Transfer to existing user
      const targetUser = targetProfiles[0];
      await db
        .update(schema.workspaces)
        .set({
          ownerId: targetUser.id,
          updatedAt: new Date(),
        })
        .where(eq(schema.workspaces.id, currentWorkspace.id));

      // Update former owner's role to Admin if needed
      await db
        .update(schema.profiles)
        .set({
          role: 'admin',
          updatedAt: new Date(),
        })
        .where(eq(schema.profiles.id, currentProfile.id));

      // Update new owner's role to Owner
      await db
        .update(schema.profiles)
        .set({
          role: 'owner',
          updatedAt: new Date(),
        })
        .where(eq(schema.profiles.id, targetUser.id));

      return NextResponse.json({
        success: true,
        message: `Workspace ownership successfully transferred to ${targetUser.fullName || targetUser.email}.`,
      });
    } else {
      // Recipient is not yet a registered user — record pending transfer in metadata
      const currentMeta = (currentWorkspace.metadata || {}) as Record<string, unknown>;
      await db
        .update(schema.workspaces)
        .set({
          metadata: {
            ...currentMeta,
            pendingOwnershipTransfer: {
              targetEmail: targetEmail.trim().toLowerCase(),
              initiatedAt: new Date().toISOString(),
              initiatedBy: currentProfile.email,
            },
          },
          updatedAt: new Date(),
        })
        .where(eq(schema.workspaces.id, currentWorkspace.id));

      return NextResponse.json({
        success: true,
        message: `Transfer invitation sent to ${targetEmail}. Ownership will automatically transfer when they accept.`,
      });
    }
  } catch (err) {
    console.error('[WORKSPACE TRANSFER ERROR]', err);
    return NextResponse.json({ success: false, error: 'Unable to transfer workspace ownership. Please try again later.' }, { status: 500 });
  }
}
