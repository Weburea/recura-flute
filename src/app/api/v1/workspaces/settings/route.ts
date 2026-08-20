import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getSession } from '@/lib/session';
import { sendWelcomeEmail } from '@/lib/email';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 1. Get active workspace or first workspace owned by the user
    const workspaceId = session.activeWorkspaceId;
    let targetWorkspace = null;

    if (workspaceId) {
      const workspaces = await db
        .select()
        .from(schema.workspaces)
        .where(eq(schema.workspaces.id, workspaceId))
        .limit(1);
      if (workspaces.length > 0) {
        targetWorkspace = workspaces[0];
      }
    }

    if (!targetWorkspace) {
      const workspaces = await db
        .select()
        .from(schema.workspaces)
        .where(eq(schema.workspaces.ownerId, session.userId))
        .limit(1);
      if (workspaces.length > 0) {
        targetWorkspace = workspaces[0];
      }
    }

    if (!targetWorkspace) {
      return NextResponse.json(
        { success: false, error: 'Workspace not found' },
        { status: 404 }
      );
    }

    // 2. Parse request body if present
    let settingsPayload: Record<string, unknown> = {};
    try {
      const body = await request.json() as Record<string, unknown>;
      if (body && typeof body === 'object' && body.settings && typeof body.settings === 'object') {
        settingsPayload = body.settings as Record<string, unknown>;
      }
    } catch {
      // Empty or invalid body
    }

    const currentSettings = targetWorkspace.settings || {};
    const alreadySeen = currentSettings.welcome_seen === true;

    const welcomeSeenValue = settingsPayload.welcome_seen !== undefined
      ? settingsPayload.welcome_seen
      : true;

    const newSettings = {
      ...currentSettings,
      ...settingsPayload,
      welcome_seen: welcomeSeenValue === true,
    };

    await db
      .update(schema.workspaces)
      .set({ settings: newSettings })
      .where(eq(schema.workspaces.id, targetWorkspace.id));

    // 3. Send welcome email if not already triggered
    if (!alreadySeen) {
      const profiles = await db
        .select()
        .from(schema.profiles)
        .where(eq(schema.profiles.id, session.userId))
        .limit(1);

      if (profiles.length > 0) {
        const profile = profiles[0];
        try {
          await sendWelcomeEmail(
            profile.email,
            profile.fullName,
            targetWorkspace.name,
            targetWorkspace.businessType
          );
        } catch (emailErr) {
          console.error('[EMAIL ERROR] Failed to send welcome email:', emailErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Workspace settings updated successfully.',
    });
  } catch (err) {
    console.error('Error in POST /api/v1/workspaces/settings:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
