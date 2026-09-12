import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verify2FAToken } from '@/lib/totp';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { secret, code } = body;

    if (!secret || !code || String(code).trim().length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Secret key and 6-digit verification code are required' },
        { status: 400 }
      );
    }

    // Verify token
    const isValid = verify2FAToken(String(code), secret);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid 6-digit code. Please check your Authenticator app and try again.' },
        { status: 400 }
      );
    }

    // Enable 2FA in profile
    await db
      .update(schema.profiles)
      .set({
        twoFactorEnabled: true,
        twoFactorSecret: secret,
        updatedAt: new Date(),
      })
      .where(eq(schema.profiles.id, session.userId));

    return NextResponse.json({
      success: true,
      message: 'Two-factor authentication successfully enabled!',
    });
  } catch (err) {
    console.error('[2FA ENABLE ERROR]', err);
    return NextResponse.json(
      { success: false, error: 'Failed to activate 2FA. Please try again.' },
      { status: 500 }
    );
  }
}
