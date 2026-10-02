import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createSession } from '@/lib/session';
import { AUTH_BYPASS_CONFIG } from '@/config/auth-bypass';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const cleanEmail = email ? email.trim().toLowerCase() : AUTH_BYPASS_CONFIG.defaultUser.email;

    if (AUTH_BYPASS_CONFIG.enabled) {
      await createSession({
        userId: AUTH_BYPASS_CONFIG.defaultUser.id,
        email: cleanEmail,
        fullName: AUTH_BYPASS_CONFIG.defaultUser.fullName,
        role: AUTH_BYPASS_CONFIG.defaultUser.role,
        activeWorkspaceId: AUTH_BYPASS_CONFIG.defaultWorkspace.id,
      });

      return NextResponse.json({
        success: true,
        message: 'Sign in successful (preview mode)',
      });
    }

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Fetch profile
    const profiles = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.email, cleanEmail))
      .limit(1);

    if (profiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const profile = profiles[0];

    // Check if password hash exists (OAuth-only users do not have a password hash)
    if (!profile.passwordHash) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 2. Verify password
    const isPasswordMatch = await bcrypt.compare(password, profile.passwordHash);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // 3. Check if 2FA is enabled
    if (profile.twoFactorEnabled && profile.twoFactorSecret) {
      const { create2FATempToken } = await import('@/lib/totp');
      const twoFactorToken = create2FATempToken(profile.id);
      return NextResponse.json({
        success: true,
        requires2FA: true,
        twoFactorToken,
        message: 'Please enter the 6-digit code from your Authenticator app',
      });
    }

    // 4. Check if workspace onboarding is completed
    const userWorkspaces = await db
      .select()
      .from(schema.userWorkspaces)
      .where(eq(schema.userWorkspaces.userId, profile.id))
      .limit(1);

    const activeWorkspaceId = userWorkspaces[0]?.workspaceId;

    // Create session cookie
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
    console.error('Signin error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error during sign in' },
      { status: 500 }
    );
  }
}
