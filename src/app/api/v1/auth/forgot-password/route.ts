import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendPasswordResetEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email address is required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if account exists
    const profiles = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.email, cleanEmail))
      .limit(1);

    if (profiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No account found with this email address' },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP Code
    const rawOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtpCode = await bcrypt.hash(rawOtpCode, 10);
    const tokenId = `vt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const expiresAt = new Date(Date.now() + 60 * 1000); // 60 seconds

    // Delete old password_reset tokens
    await db
      .delete(schema.verificationTokens)
      .where(eq(schema.verificationTokens.identifier, cleanEmail));

    await db.insert(schema.verificationTokens).values({
      id: tokenId,
      identifier: cleanEmail,
      code: hashedOtpCode,
      type: 'password_reset',
      expiresAt,
    });

    const profile = profiles[0];

    // Send real password reset email
    await sendPasswordResetEmail(cleanEmail, profile.fullName, rawOtpCode);

    return NextResponse.json({
      success: true,
      message: 'Password reset code sent to your email.',
      email: cleanEmail,
    });
  } catch (err) {
    console.error('[AUTH ERROR] Forgot password failure:', err);
    return NextResponse.json(
      { success: false, error: 'Unable to process password reset request. Please try again later.' },
      { status: 500 }
    );
  }
}
