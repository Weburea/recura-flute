import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { createSession } from '@/lib/session';
import { AUTH_BYPASS_CONFIG } from '@/config/auth-bypass';

export async function POST(request: Request) {
  try {
    if (AUTH_BYPASS_CONFIG.enabled) {
      return NextResponse.json({
        success: true,
        redirectUrl: '/choose-business',
        message: 'Email verification bypassed in preview mode',
      });
    }

    const body = await request.json();
    const { email, code } = body;

    if (!email || !code || code.length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Valid email and 6-digit verification code are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Fetch active verification token
    const tokens = await db
      .select()
      .from(schema.verificationTokens)
      .where(
        and(
          eq(schema.verificationTokens.identifier, cleanEmail),
          eq(schema.verificationTokens.type, 'email_verification')
        )
      )
      .limit(1);

    if (tokens.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No active verification code found for this email' },
        { status: 400 }
      );
    }

    const token = tokens[0];

    // Check expiration
    if (new Date() > new Date(token.expiresAt)) {
      return NextResponse.json(
        { success: false, error: 'Verification code has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    // Verify OTP code
    const isCodeMatch = await bcrypt.compare(code, token.code);
    if (!isCodeMatch) {
      // Increment attempt count
      await db
        .update(schema.verificationTokens)
        .set({ attempts: token.attempts + 1 })
        .where(eq(schema.verificationTokens.id, token.id));

      return NextResponse.json(
        { success: false, error: 'Invalid verification code. Please check and try again.' },
        { status: 400 }
      );
    }

    // 2. Fetch user profile
    const profiles = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.email, cleanEmail))
      .limit(1);

    if (profiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    const profile = profiles[0];

    // 3. Mark profile as verified
    await db
      .update(schema.profiles)
      .set({
        emailVerified: true,
        emailVerifiedAt: new Date(),
      })
      .where(eq(schema.profiles.id, profile.id));

    // Delete used token
    await db
      .delete(schema.verificationTokens)
      .where(eq(schema.verificationTokens.id, token.id));

    // 4. Create Session Cookie
    await createSession({
      userId: profile.id,
      email: profile.email,
      fullName: profile.fullName,
      role: profile.role,
    });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully!',
      redirectUrl: '/choose-business',
    });
  } catch (err) {
    console.error('[AUTH ERROR] Verify email failure:', err);
    return NextResponse.json(
      { success: false, error: 'Verification failed. Please check your code and try again, or request a new code.' },
      { status: 500 }
    );
  }
}
