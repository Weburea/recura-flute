import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getSession } from '@/lib/session';
import { eq, and, ne } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

function parseUserAgent(uaString: string) {
  let browser = 'Unknown Browser';
  let device = 'Desktop';

  if (uaString.includes('Firefox')) browser = 'Firefox';
  else if (uaString.includes('Chrome')) browser = 'Chrome';
  else if (uaString.includes('Safari')) browser = 'Safari';
  else if (uaString.includes('Edge')) browser = 'Edge';

  if (uaString.includes('Windows')) device = 'Windows';
  else if (uaString.includes('Macintosh') || uaString.includes('Mac OS')) device = 'Mac';
  else if (uaString.includes('iPhone')) device = 'iPhone';
  else if (uaString.includes('Android')) device = 'Android';
  else if (uaString.includes('Linux')) device = 'Linux';

  return `${browser} - ${device}`;
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userSessions = await db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.userId, session.userId))
      .orderBy(schema.sessions.createdAt);

    const formattedSessions = userSessions.map((s) => {
      // Format timestamp to relative or friendly time
      const timeDiff = Date.now() - new Date(s.createdAt).getTime();
      let timeStr = 'Just now';
      const mins = Math.floor(timeDiff / (1000 * 60));
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      if (days > 0) {
        timeStr = days === 1 ? '1 day ago' : `${days} days ago`;
      } else if (hours > 0) {
        timeStr = hours === 1 ? '1 hour ago' : `${hours} hours ago`;
      } else if (mins > 0) {
        timeStr = mins === 1 ? '1 minute ago' : `${mins} minutes ago`;
      }

      return {
        id: s.id,
        browser: parseUserAgent(s.userAgent || ''),
        location: s.ipAddress === '127.0.0.1' || s.ipAddress === '::1' ? 'Localhost' : 'Remote Access',
        time: timeStr,
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
