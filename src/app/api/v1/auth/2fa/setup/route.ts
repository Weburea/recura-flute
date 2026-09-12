import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { generate2FASecret } from '@/lib/totp';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const session = await getSession();
    if (!session?.userId || !session.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { secret, qrCodeDataUrl } = await generate2FASecret(session.email);

    return NextResponse.json({
      success: true,
      secret,
      qrCodeDataUrl,
    });
  } catch (err) {
    console.error('[2FA SETUP ERROR]', err);
    return NextResponse.json(
      { success: false, error: 'Unable to initialize 2FA setup. Please try again.' },
      { status: 500 }
    );
  }
}
