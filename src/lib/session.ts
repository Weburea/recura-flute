import { cookies } from 'next/headers';

export interface SessionData {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  activeWorkspaceId?: string;
}

const SESSION_COOKIE_NAME = 'recura_session';

export async function createSession(data: SessionData) {
  const cookieStore = await cookies();
  const sessionValue = JSON.stringify(data);

  cookieStore.set(SESSION_COOKIE_NAME, Buffer.from(sessionValue).toString('base64'), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!cookie?.value) return null;

    const sessionValue = Buffer.from(cookie.value, 'base64').toString('utf-8');
    return JSON.parse(sessionValue) as SessionData;
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
