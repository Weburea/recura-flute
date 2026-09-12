import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getSession } from '@/lib/session';
import { eq, ne, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      fullName, 
      email, 
      phone, 
      jobTitle, 
      timezone, 
      language, 
      avatarUrl,
      currentPassword,
      newPassword 
    } = body;

    // Check if profile exists
    const profiles = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.id, session.userId))
      .limit(1);

    if (profiles.length === 0) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    const profile = profiles[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};

    // 1. Email check (must be unique)
    if (email && email.trim().toLowerCase() !== profile.email) {
      const cleanEmail = email.trim().toLowerCase();
      const existingEmail = await db
        .select()
        .from(schema.profiles)
        .where(
          and(
            eq(schema.profiles.email, cleanEmail),
            ne(schema.profiles.id, session.userId)
          )
        )
        .limit(1);

      if (existingEmail.length > 0) {
        return NextResponse.json({ success: false, error: 'Email address is already in use by another account' }, { status: 400 });
      }
      updateData.email = cleanEmail;
    }

    // 2. Personal Information updates
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (jobTitle !== undefined) updateData.jobTitle = jobTitle;
    if (timezone !== undefined) updateData.timezone = timezone;
    if (language !== undefined) updateData.language = language;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    // 3. Password update logic
    if (newPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json({ success: false, error: 'New password must be at least 8 characters long' }, { status: 400 });
      }

      if (profile.passwordHash) {
        // User has an existing password, currentPassword is required
        if (!currentPassword) {
          return NextResponse.json({ success: false, error: 'Current password is required to change password' }, { status: 400 });
        }

        const isMatch = await bcrypt.compare(currentPassword, profile.passwordHash);
        if (!isMatch) {
          return NextResponse.json({ success: false, error: 'Incorrect current password' }, { status: 400 });
        }
      }

      // Hash the new password
      const passwordHash = await bcrypt.hash(newPassword, 10);
      updateData.passwordHash = passwordHash;
    }

    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = new Date();
      await db
        .update(schema.profiles)
        .set(updateData)
        .where(eq(schema.profiles.id, session.userId));

      // If password was updated, send a security email notification
      if (newPassword) {
        try {
          const { sendPasswordUpdatedEmail } = await import('@/lib/email');
          await sendPasswordUpdatedEmail(profile.email, profile.fullName);
        } catch (emailErr) {
          console.error('[EMAIL ERROR] Failed to send password update notification:', emailErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully!',
    });
  } catch (err) {
    console.error('[PROFILE ERROR] Error in PUT /api/v1/auth/profile:', err);
    return NextResponse.json({ success: false, error: 'Unable to update profile. Please try again later.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Completely wipe the profile record. Cascade rules handle related workspace/contract data
    await db
      .delete(schema.profiles)
      .where(eq(schema.profiles.id, session.userId));

    // Clear session cookies
    const cookieStore = await cookies();
    cookieStore.delete('recura_session');

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (err) {
    console.error('Error in DELETE /api/v1/auth/profile:', err);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
