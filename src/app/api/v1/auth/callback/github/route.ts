import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { createSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

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
    console.error('GitHub OAuth error param:', errorParam);
    return NextResponse.redirect(`${baseUrl}/sign-in?error=github_auth_failed`);
  }

  try {
    const githubClientId = process.env.AUTH_GITHUB_ID;
    const githubClientSecret = process.env.AUTH_GITHUB_SECRET;

    if (!githubClientId || !githubClientSecret) {
      throw new Error('GitHub OAuth credentials not configured in environment variables');
    }

    const redirectUri = `${baseUrl}/api/v1/auth/callback/github`;

    // 1. Exchange authorization code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: githubClientId,
        client_secret: githubClientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok || !tokens.access_token) {
      console.error('Failed to obtain GitHub access token:', tokens);
      return NextResponse.redirect(`${baseUrl}/sign-in?error=github_token_failed`);
    }

    const accessToken = tokens.access_token;

    // 2. Fetch GitHub user profile
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'Recura-App',
      },
    });

    const githubUser = await userResponse.json();

    if (!userResponse.ok || !githubUser.id) {
      console.error('Failed to fetch GitHub user profile:', githubUser);
      return NextResponse.redirect(`${baseUrl}/sign-in?error=github_profile_failed`);
    }

    // Determine primary email address
    let userEmail = githubUser.email;

    if (!userEmail) {
      // Fetch user emails list from GitHub API
      const emailsResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'Recura-App',
        },
      });

      if (emailsResponse.ok) {
        const emails = await emailsResponse.json();
        const primaryEmailObj = emails.find(
          (e: { primary: boolean; verified: boolean; email: string }) => e.primary && e.verified
        ) || emails[0];

        if (primaryEmailObj?.email) {
          userEmail = primaryEmailObj.email;
        }
      }
    }

    if (!userEmail) {
      // Fallback if no email is configured on GitHub account
      userEmail = `${githubUser.login}@users.noreply.github.com`;
    }

    const cleanEmail = userEmail.trim().toLowerCase();
    const fullName = githubUser.name || githubUser.login || cleanEmail.split('@')[0];
    const avatarUrl = githubUser.avatar_url || null;
    const githubAccountId = String(githubUser.id);

    // 3. Database operations (Profiles & Accounts)
    let profile: schema.Profile;

    const existingProfiles = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.email, cleanEmail))
      .limit(1);

    const isNewUser = existingProfiles.length === 0;

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
          eq(schema.accounts.provider, 'github'),
          eq(schema.accounts.providerAccountId, githubAccountId)
        )
      )
      .limit(1);

    if (existingAccounts.length === 0) {
      const newAccountId = `acc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await db.insert(schema.accounts).values({
        id: newAccountId,
        userId: profile.id,
        provider: 'github',
        providerAccountId: githubAccountId,
        accessToken,
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

    // 6. Redirect to dashboard if existing user with an active workspace, otherwise to choose-business
    if (isNewUser || !activeWorkspace) {
      return NextResponse.redirect(`${baseUrl}/choose-business`);
    }

    return NextResponse.redirect(`${baseUrl}/dashboard`);
  } catch (err) {
    console.error('GitHub OAuth callback error:', err);
    return NextResponse.redirect(`${baseUrl}/sign-in?error=github_callback_exception`);
  }
}
