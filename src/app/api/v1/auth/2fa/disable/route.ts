import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { verify2FAToken } from '@/lib/totp';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { password, code } = body;

    const profiles = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.id, session.userId))
      .limit(1);

    if (profiles.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const profile = profiles[0];

    // If password or code provided, verify security
    if (code && profile.twoFactorSecret) {
      const isValidCode = verify2FAToken(String(code), profile.twoFactorSecret);
      if (!isValidCode) {
        return NextResponse.json(
          { success: false, error: 'Invalid 6-digit verification code.' },
          { status: 400 }
        );
      }
    } else if (password && profile.passwordHash) {
      const isValidPassword = await bcrypt.compare(password, profile.passwordHash);
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, error: 'Incorrect password.' },
          { status: 400 }
        );
      }
    }

    // Disable 2FA
    await db
      .update(schema.profiles)
      .set({
        twoFactorEnabled: false,
        twoFactorSecret: null,
        updatedAt: new Date(),
      })
      .where(eq(schema.profiles.id, session.userId));

    return NextResponse.json({
      success: true,
      message: 'Two-factor authentication has been disabled.',
    });
  } catch (err) {
    console.error('[2FA DISABLE ERROR]', err);
    return NextResponse.json(
      { success: false, error: 'Failed to disable 2FA. Please try again.' },
      { status: 500 }
    );
  }
}
