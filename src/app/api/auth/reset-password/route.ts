import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Email and password (minimum 8 characters) are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check profile
    const profiles = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.email, cleanEmail))
      .limit(1);

    if (profiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User account not found' },
        { status: 404 }
      );
    }

    const profile = profiles[0];

    // Hash new password and update profile
    const passwordHash = await bcrypt.hash(password, 10);
    await db
      .update(schema.profiles)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(schema.profiles.id, profile.id));

    // Delete password_reset tokens for this email
    await db
      .delete(schema.verificationTokens)
      .where(eq(schema.verificationTokens.identifier, cleanEmail));

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully!',
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
