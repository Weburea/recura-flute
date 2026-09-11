import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendVerificationEmail } from '@/lib/email';

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

    // Fetch user profile
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

    const profile = profiles[0];

    // Generate new 6-digit OTP Code
    const rawOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtpCode = await bcrypt.hash(rawOtpCode, 10);
    const tokenId = `vt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const expiresAt = new Date(Date.now() + 60 * 1000); // 60 seconds

    // Delete old verification tokens for this email
    await db
      .delete(schema.verificationTokens)
      .where(eq(schema.verificationTokens.identifier, cleanEmail));

    await db.insert(schema.verificationTokens).values({
      id: tokenId,
      identifier: cleanEmail,
      code: hashedOtpCode,
      type: 'email_verification',
      expiresAt,
    });

    // Send real OTP email
    await sendVerificationEmail(cleanEmail, profile.fullName, rawOtpCode);

    return NextResponse.json({
      success: true,
      message: 'Fresh verification code sent to your email.',
      email: cleanEmail,
    });
  } catch (err) {
    console.error('[AUTH ERROR] Resend verification failure:', err);
    return NextResponse.json(
      { success: false, error: 'Unable to resend verification code. Please try again later.' },
      { status: 500 }
    );
  }
}
