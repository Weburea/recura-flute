import { NextResponse } from 'next/server';

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
  const githubClientId = process.env.AUTH_GITHUB_ID;

  if (!githubClientId) {
    return NextResponse.json(
      { success: false, error: 'GitHub OAuth Client ID is not configured' },
      { status: 500 }
    );
  }

  const baseUrl = getBaseUrl(request);
  const redirectUri = `${baseUrl}/api/auth/callback/github`;

  const params = new URLSearchParams({
    client_id: githubClientId,
    redirect_uri: redirectUri,
    scope: 'read:user user:email',
  });

  const githubAuthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;

  return NextResponse.redirect(githubAuthUrl);
}
