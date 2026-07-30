import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { createSession } from '@/lib/session';

function getBaseUrl(request: Request) {
  const host = request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  if (host) {
    return `${proto}://${host}`;
  }
  return process.env.NEXTAUTH_URL || 'http://localhost:4000';
}

export async function GET(request: Request) {
  const baseUrl = getBaseUrl(request);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const errorParam = searchParams.get('error');

  if (errorParam || !code) {
    console.error('Google OAuth error param:', errorParam);
    return NextResponse.redirect(`${baseUrl}/sign-in?error=google_auth_failed`);
  }

  try {
    const googleClientId = process.env.AUTH_GOOGLE_ID;
    const googleClientSecret = process.env.AUTH_GOOGLE_SECRET;

    if (!googleClientId || !googleClientSecret) {
      throw new Error('Google OAuth credentials not configured in environment variables');
    }

    const redirectUri = `${baseUrl}/api/auth/callback/google`;

    // 1. Exchange code for OAuth tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok || !tokens.access_token) {
      console.error('Failed to obtain Google access token:', tokens);
      return NextResponse.redirect(`${baseUrl}/sign-in?error=google_token_failed`);
    }

    // 2. Fetch Google user profile
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await userResponse.json();

    if (!userResponse.ok || !googleUser.email) {
      console.error('Failed to fetch Google user profile:', googleUser);
      return NextResponse.redirect(`${baseUrl}/sign-in?error=google_profile_failed`);
    }

    const cleanEmail = googleUser.email.trim().toLowerCase();
    const fullName = googleUser.name || cleanEmail.split('@')[0];
    const avatarUrl = googleUser.picture || null;
    const googleAccountId = String(googleUser.id);

    // 3. Database operations (Profiles & Accounts)
    let profile: schema.Profile;

    const existingProfiles = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.email, cleanEmail))
      .limit(1);

    if (existingProfiles.length > 0) {
      profile = existingProfiles[0];
      // Update verified status and avatar if needed
      await db
        .update(schema.profiles)
        .set({
          emailVerified: true,
          emailVerifiedAt: profile.emailVerifiedAt || new Date(),
          avatarUrl: profile.avatarUrl || avatarUrl,
          updatedAt: new Date(),
        })
        .where(eq(schema.profiles.id, profile.id));
    } else {
      // Create new profile
      const newUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const insertedProfiles = await db
        .insert(schema.profiles)
        .values({
          id: newUserId,
          email: cleanEmail,
          fullName,
          avatarUrl,
          emailVerified: true,
          emailVerifiedAt: new Date(),
          role: 'owner',
        })
        .returning();

      profile = insertedProfiles[0];
    }

    // Check if account link exists
    const existingAccounts = await db
      .select()
      .from(schema.accounts)
      .where(
        and(
          eq(schema.accounts.provider, 'google'),
          eq(schema.accounts.providerAccountId, googleAccountId)
        )
      )
      .limit(1);

    if (existingAccounts.length === 0) {
      const newAccountId = `acc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await db.insert(schema.accounts).values({
        id: newAccountId,
        userId: profile.id,
        provider: 'google',
        providerAccountId: googleAccountId,
        accessToken: tokens.access_token || null,
        refreshToken: tokens.refresh_token || null,
        expiresAt: tokens.expires_in ? Math.floor(Date.now() / 1000) + tokens.expires_in : null,
      });
    }

    // 4. Check workspace status
    const existingWorkspaces = await db
      .select()
      .from(schema.workspaces)
      .where(eq(schema.workspaces.ownerId, profile.id))
      .limit(1);

    const activeWorkspace = existingWorkspaces.length > 0 ? existingWorkspaces[0] : null;

    // 5. Establish session cookie
    await createSession({
      userId: profile.id,
      email: profile.email,
      fullName: profile.fullName,
      role: profile.role,
      activeWorkspaceId: activeWorkspace?.id,
    });

    // 6. Redirect to onboarding or dashboard
    if (!activeWorkspace || !activeWorkspace.onboardingCompleted) {
      return NextResponse.redirect(`${baseUrl}/choose-business`);
    }

    return NextResponse.redirect(`${baseUrl}/choose-business`);
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(`${baseUrl}/sign-in?error=google_callback_exception`);
  }
}
