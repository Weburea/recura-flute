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
  const googleClientId = process.env.AUTH_GOOGLE_ID;

  if (!googleClientId) {
    return NextResponse.json(
      { success: false, error: 'Google OAuth Client ID is not configured' },
      { status: 500 }
    );
  }

  const baseUrl = getBaseUrl(request);
  const redirectUri = `${baseUrl}/api/v1/auth/callback/google`;

  const params = new URLSearchParams({
    client_id: googleClientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  return NextResponse.redirect(googleAuthUrl);
}
