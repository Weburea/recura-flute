import { cookies, headers } from 'next/headers';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq, and, gte } from 'drizzle-orm';
import { AUTH_BYPASS_CONFIG } from '@/config/auth-bypass';

export interface SessionData {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  activeWorkspaceId?: string;
  sessionId?: string;
}

const SESSION_COOKIE_NAME = 'recura_session';

export async function createSession(data: SessionData) {
  const cookieStore = await cookies();
  const headersList = await headers();

  const sessionId = crypto.randomUUID();
  const userAgent = headersList.get('user-agent') || 'Unknown Browser';
  const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '127.0.0.1';
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // Insert session row into the database
  try {
    await db.insert(schema.sessions).values({
      id: sessionId,
      userId: data.userId,
      userAgent,
      ipAddress,
      expiresAt,
    });
  } catch (err) {
    console.error('Failed to save session to DB:', err);
  }

  const sessionValue = JSON.stringify({ ...data, sessionId });

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

    // If auth bypass is enabled for design demos, return sessionData or default mock session
    if (AUTH_BYPASS_CONFIG.enabled) {
      if (cookie?.value) {
        try {
          const sessionValue = Buffer.from(cookie.value, 'base64').toString('utf-8');
          const sessionData = JSON.parse(sessionValue) as SessionData;
          if (sessionData?.userId) return sessionData;
        } catch {
          // fallback to default mock session below
        }
      }
      return {
        userId: AUTH_BYPASS_CONFIG.defaultUser.id,
        email: AUTH_BYPASS_CONFIG.defaultUser.email,
        fullName: AUTH_BYPASS_CONFIG.defaultUser.fullName,
        role: AUTH_BYPASS_CONFIG.defaultUser.role,
        activeWorkspaceId: AUTH_BYPASS_CONFIG.defaultWorkspace.id,
      };
    }

    if (!cookie?.value) return null;

    const sessionValue = Buffer.from(cookie.value, 'base64').toString('utf-8');
    const sessionData = JSON.parse(sessionValue) as SessionData;

    // Verify session ID in database
    if (sessionData.sessionId) {
      const activeSessionsList = await db
        .select()
        .from(schema.sessions)
        .where(
          and(
            eq(schema.sessions.id, sessionData.sessionId),
            gte(schema.sessions.expiresAt, new Date())
          )
        )
        .limit(1);

      if (activeSessionsList.length === 0) {
        // Session has been invalidated or expired
        cookieStore.delete(SESSION_COOKIE_NAME);
        return null;
      }
    }

    return sessionData;
  } catch {
    return null;
  }
}

export async function clearSession() {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (cookie?.value) {
      const sessionValue = Buffer.from(cookie.value, 'base64').toString('utf-8');
      const sessionData = JSON.parse(sessionValue) as SessionData;

      if (sessionData.sessionId) {
        await db.delete(schema.sessions).where(eq(schema.sessions.id, sessionData.sessionId));
      }
    }

    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (err) {
    console.error('Failed to clear session:', err);
    // Ensure cookie is deleted even if DB call fails
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  }
}
