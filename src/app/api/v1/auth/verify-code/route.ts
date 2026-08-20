import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code || code.length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Email and 6-digit code are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Fetch active password reset token
    const tokens = await db
      .select()
      .from(schema.verificationTokens)
      .where(
        and(
          eq(schema.verificationTokens.identifier, cleanEmail),
          eq(schema.verificationTokens.type, 'password_reset')
        )
      )
      .limit(1);

    if (tokens.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No active password reset code found for this email' },
        { status: 400 }
      );
    }

    const token = tokens[0];

    if (new Date() > new Date(token.expiresAt)) {
      return NextResponse.json(
        { success: false, error: 'Password reset code has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    const isCodeMatch = await bcrypt.compare(code, token.code);
    if (!isCodeMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid 6-digit verification code' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Code verified successfully',
      redirectUrl: `/reset-password?email=${encodeURIComponent(cleanEmail)}&token=${token.id}`,
    });
  } catch (err) {
    console.error('Verify code error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
