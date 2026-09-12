import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createSession } from '@/lib/session';
import { verify2FATempToken, verify2FAToken } from '@/lib/totp';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { twoFactorToken, code } = body;

    if (!twoFactorToken || !code || String(code).trim().length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Valid 2FA session and 6-digit code are required' },
        { status: 400 }
      );
    }

    // 1. Verify challenge token
    const userId = verify2FATempToken(twoFactorToken);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: '2FA verification session expired. Please sign in again.' },
        { status: 401 }
      );
    }

    // 2. Query user profile
    const profiles = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.id, userId))
      .limit(1);

    if (profiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    const profile = profiles[0];

    if (!profile.twoFactorEnabled || !profile.twoFactorSecret) {
      return NextResponse.json(
        { success: false, error: '2FA is not enabled on this account' },
        { status: 400 }
      );
    }

    // 3. Verify TOTP token
    const isTotpValid = verify2FAToken(String(code), profile.twoFactorSecret);
    if (!isTotpValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid authenticator code. Please check your app and try again.' },
        { status: 400 }
      );
    }

    // 4. Fetch active workspace
    const userWorkspaces = await db
      .select()
      .from(schema.userWorkspaces)
      .where(eq(schema.userWorkspaces.userId, profile.id))
      .limit(1);

    const activeWorkspaceId = userWorkspaces[0]?.workspaceId;

    // 5. Create real session
    await createSession({
      userId: profile.id,
      email: profile.email,
      fullName: profile.fullName,
      role: profile.role,
      activeWorkspaceId,
    });

    return NextResponse.json({
      success: true,
      message: 'Signed in successfully!',
      redirectUrl: '/dashboard',
    });
  } catch (err) {
    console.error('[2FA LOGIN VERIFY ERROR]', err);
    return NextResponse.json(
      { success: false, error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}
