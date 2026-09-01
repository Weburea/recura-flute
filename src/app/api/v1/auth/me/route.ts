import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getSession } from '@/lib/session';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. Query user profile
    const profiles = await db
      .select({
        id: schema.profiles.id,
        email: schema.profiles.email,
        fullName: schema.profiles.fullName,
        avatarUrl: schema.profiles.avatarUrl,
        phone: schema.profiles.phone,
        jobTitle: schema.profiles.jobTitle,
        timezone: schema.profiles.timezone,
        language: schema.profiles.language,
        passwordHash: schema.profiles.passwordHash,
      })
      .from(schema.profiles)
      .where(eq(schema.profiles.id, session.userId))
      .limit(1);

    if (profiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    const rawUser = profiles[0];

    // Check connected providers
    const connectedAccounts = await db
      .select({
        provider: schema.accounts.provider,
      })
      .from(schema.accounts)
      .where(eq(schema.accounts.userId, session.userId));

    const user = {
      id: rawUser.id,
      email: rawUser.email,
      fullName: rawUser.fullName,
      avatarUrl: rawUser.avatarUrl,
      phone: rawUser.phone,
      jobTitle: rawUser.jobTitle,
      timezone: rawUser.timezone,
      language: rawUser.language,
      hasPassword: rawUser.passwordHash !== null,
      providers: connectedAccounts.map(a => a.provider),
    };

    // 3. Query user's active workspace
    let workspace = null;

    if (session.activeWorkspaceId) {
      const workspaces = await db
        .select({
          id: schema.workspaces.id,
          name: schema.workspaces.name,
          niche: schema.workspaces.niche,
          businessType: schema.workspaces.businessType,
          settings: schema.workspaces.settings,
          metadata: schema.workspaces.metadata,
        })
        .from(schema.workspaces)
        .where(eq(schema.workspaces.id, session.activeWorkspaceId))
        .limit(1);

      if (workspaces.length > 0) {
        workspace = workspaces[0];
      }
    }

    if (!workspace) {
      // Fallback: Query first workspace owned by the user
      const workspaces = await db
        .select({
          id: schema.workspaces.id,
          name: schema.workspaces.name,
          niche: schema.workspaces.niche,
          businessType: schema.workspaces.businessType,
          settings: schema.workspaces.settings,
          metadata: schema.workspaces.metadata,
        })
        .from(schema.workspaces)
        .where(eq(schema.workspaces.ownerId, session.userId))
        .limit(1);

      if (workspaces.length > 0) {
        workspace = workspaces[0];
      }
    }

    return NextResponse.json({
      success: true,
      user,
      workspace,
    });
  } catch (err) {
    console.error('Error in GET /api/v1/auth/me:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
