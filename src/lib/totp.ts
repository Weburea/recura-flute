import { generateSecret, generateURI, verifySync } from 'otplib';
import QRCode from 'qrcode';

/**
 * Generate a new TOTP secret, otpauth URL, and high-res base64 QR Code Data URL.
 */
export async function generate2FASecret(email: string, appName: string = 'Recura') {
  const secret = generateSecret({ length: 20 });
  const otpauthUrl = generateURI({
    issuer: appName,
    label: email,
    secret,
    strategy: 'totp',
    digits: 6,
    period: 30,
  });

  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 260,
    color: {
      dark: '#150A2E',
      light: '#FFFFFF',
    },
  });

  return {
    secret,
    otpauthUrl,
    qrCodeDataUrl,
  };
}

import crypto from 'crypto';

const AUTH_SECRET = process.env.NEXTAUTH_SECRET || 'recura_super_secret_session_key_2026';

/**
 * Generate a short-lived HMAC-signed 2FA challenge token (valid for 5 minutes).
 */
export function create2FATempToken(userId: string): string {
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins
  const payload = `${userId}:${expiresAt}`;
  const hmac = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64url');
}

/**
 * Validate the temporary 2FA challenge token and return the userId.
 */
export function verify2FATempToken(token: string): string | null {
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf-8');
    const [userId, expiresAtStr, hmac] = raw.split(':');
    if (!userId || !expiresAtStr || !hmac) return null;

    const expiresAt = parseInt(expiresAtStr, 10);
    if (Date.now() > expiresAt) return null;

    const payload = `${userId}:${expiresAtStr}`;
    const expectedHmac = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');

    if (crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac))) {
      return userId;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Verify a 6-digit TOTP token against a user's secret key.
 */
export function verify2FAToken(token: string, secret: string): boolean {
  if (!token || !secret) return false;
  const cleanToken = token.trim().replace(/\s+/g, '');
  if (cleanToken.length !== 6) return false;

  try {
    const result = verifySync({
      token: cleanToken,
      secret,
      strategy: 'totp',
      digits: 6,
      period: 30,
      epochTolerance: 30, // allows +/- 30s network/clock drift
    });
    return Boolean(result && result.valid);
  } catch (err) {
    console.error('[TOTP VERIFICATION ERROR]', err);
    return false;
  }
}


