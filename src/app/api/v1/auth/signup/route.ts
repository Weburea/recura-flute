import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check if user already exists
    const existingProfiles = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.email, cleanEmail))
      .limit(1);

    if (existingProfiles.length > 0) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // 2. Hash password & create Profile
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    await db.insert(schema.profiles).values({
      id: userId,
      email: cleanEmail,
      fullName: fullName.trim(),
      passwordHash,
      emailVerified: false,
      role: 'owner',
    });

    // 3. Generate 6-Digit OTP Code
    const rawOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtpCode = await bcrypt.hash(rawOtpCode, 10);
    const tokenId = `vt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const expiresAt = new Date(Date.now() + 60 * 1000); // 60 seconds

    // Delete any old pending verification tokens for this email
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

    try {
      // Send real OTP email
      await sendVerificationEmail(cleanEmail, fullName.trim(), rawOtpCode);
    } catch (emailErr) {
      console.error('Failed to send verification email, rolling back database entries:', emailErr);
      // Rollback database writes manually since neon-http doesn't support transactions
      await db.delete(schema.verificationTokens).where(eq(schema.verificationTokens.id, tokenId));
      await db.delete(schema.profiles).where(eq(schema.profiles.id, userId));
      
      throw new Error(`Email delivery failed: ${emailErr instanceof Error ? emailErr.message : String(emailErr)}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email for the 6-digit code.',
      email: cleanEmail,
    });
  } catch (err) {
    console.error('[AUTH ERROR] Signup failure:', err);
    const isEmailError = err instanceof Error && err.message.includes('Email delivery failed');
    return NextResponse.json(
      { 
        success: false, 
        error: isEmailError 
          ? 'Unable to send verification email. Please verify your email address or try again shortly.' 
          : 'Unable to complete registration. Please try again later.' 
      },
      { status: 500 }
    );
  }
}
