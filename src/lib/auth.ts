import { headers } from 'next/headers';
import { getSession } from '@/lib/session';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

export interface AuthResult {
  isAuthenticated: boolean;
  userId?: string;
  workspaceId?: string;
  authType?: 'cookie' | 'apikey';
}

export async function authenticateRequest(): Promise<AuthResult> {
  // 1. Read the HTTP-Only cookie (via getSession utility which reads cookies().get('recura_session'))
  const session = await getSession();
  if (session?.userId) {
    return {
      isAuthenticated: true,
      userId: session.userId,
      workspaceId: session.activeWorkspaceId,
      authType: 'cookie',
    };
  }

  // 2. Read the API Key header: headers.get('x-api-key')
  const headersList = await headers();
  const apiKey = headersList.get('x-api-key');
  if (apiKey) {
    const hashedKey = hashApiKey(apiKey);
    const result = await db
      .select({ id: schema.workspaces.id, ownerId: schema.workspaces.ownerId })
      .from(schema.workspaces)
      .where(eq(schema.workspaces.apiKey, hashedKey))
      .limit(1);

    if (result.length > 0) {
      return {
        isAuthenticated: true,
        userId: result[0].ownerId,
        workspaceId: result[0].id,
        authType: 'apikey',
      };
    }
  }

  return {
    isAuthenticated: false,
  };
}
