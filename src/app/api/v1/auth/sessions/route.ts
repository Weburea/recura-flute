import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getSession } from '@/lib/session';
import { eq, and, ne, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export type DeviceType = 'laptop' | 'mobile' | 'tablet';

export interface ParsedDeviceInfo {
  browser: string;
  os: string;
  deviceType: DeviceType;
  displayName: string;
}

export function parseUserAgent(uaString: string): ParsedDeviceInfo {
  let browser = 'Chrome';
  let os = 'Windows';
  let deviceType: DeviceType = 'laptop';

  const ua = uaString || '';

  // Browser detection
  if (ua.includes('Edg/') || ua.includes('Edge/')) browser = 'Edge';
  else if (ua.includes('OPR/') || ua.includes('Opera/')) browser = 'Opera';
  else if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('Chrome/')) browser = 'Chrome';
  else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Safari';

  // Device & OS detection
  if (ua.includes('iPad') || (ua.includes('Macintosh') && ua.includes('Touch'))) {
    deviceType = 'tablet';
    os = 'iPadOS';
  } else if (ua.includes('Tablet') || (ua.includes('Android') && !ua.includes('Mobile'))) {
    deviceType = 'tablet';
    os = 'Android Tablet';
  } else if (ua.includes('iPhone')) {
    deviceType = 'mobile';
    os = 'iPhone';
  } else if (ua.includes('Android') && ua.includes('Mobile')) {
    deviceType = 'mobile';
    os = 'Android';
  } else if (ua.includes('Windows')) {
    deviceType = 'laptop';
    os = 'Windows';
  } else if (ua.includes('Macintosh') || ua.includes('Mac OS')) {
    deviceType = 'laptop';
    os = 'macOS';
  } else if (ua.includes('Linux')) {
    deviceType = 'laptop';
    os = 'Linux';
  }

  const displayName = `${browser} on ${os}`;
  return { browser, os, deviceType, displayName };
}

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const query = db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.userId, session.userId))
      .orderBy(desc(schema.sessions.createdAt));

    const userSessions = limit ? await query.limit(limit) : await query;

    const formattedSessions = userSessions.map((s) => {
      const parsed = parseUserAgent(s.userAgent || '');

      // Format timestamp to relative friendly time
      const timeDiff = Date.now() - new Date(s.createdAt).getTime();
      let timeStr = 'Active Now';
      const mins = Math.floor(timeDiff / (1000 * 60));
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      if (days > 0) {
        timeStr = days === 1 ? '1 day ago' : `${days} days ago`;
      } else if (hours > 0) {
        timeStr = hours === 1 ? '1 hour ago' : `${hours} hours ago`;
      } else if (mins > 1) {
        timeStr = `${mins} mins ago`;
      }

      return {
        id: s.id,
        browser: parsed.displayName,
        browserName: parsed.browser,
        os: parsed.os,
        deviceType: parsed.deviceType,
        name: parsed.displayName,
        location: s.ipAddress === '127.0.0.1' || s.ipAddress === '::1' ? 'Localhost' : 'Remote Access',
        ip: s.ipAddress === '127.0.0.1' || s.ipAddress === '::1' ? '127.0.0.1' : s.ipAddress || 'Localhost',
        time: s.id === session.sessionId ? 'Active Now' : timeStr,
        createdAt: s.createdAt,
        isActive: s.id === session.sessionId,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedSessions,
    });
  } catch (err) {
    console.error('Error in GET /api/v1/auth/sessions:', err);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const targetSessionId = searchParams.get('sessionId');

    if (targetSessionId) {
      // Invalidate a specific session
      await db
        .delete(schema.sessions)
        .where(
          and(
            eq(schema.sessions.id, targetSessionId),
            eq(schema.sessions.userId, session.userId)
          )
        );
    } else {
      // Invalidate all other sessions (exclude current session)
      if (session.sessionId) {
        await db
          .delete(schema.sessions)
          .where(
            and(
              eq(schema.sessions.userId, session.userId),
              ne(schema.sessions.id, session.sessionId)
            )
          );
      } else {
        // Fallback: delete all if no current sessionId
        await db.delete(schema.sessions).where(eq(schema.sessions.userId, session.userId));
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Sessions terminated successfully',
    });
  } catch (err) {
    console.error('Error in DELETE /api/v1/auth/sessions:', err);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
