import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getSession } from '@/lib/session';
import { eq, and, inArray } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let workspaceId = session.activeWorkspaceId;
    if (!workspaceId) {
      const workspaces = await db
        .select()
        .from(schema.workspaces)
        .where(eq(schema.workspaces.ownerId, session.userId))
        .limit(1);
      if (workspaces.length > 0) {
        workspaceId = workspaces[0].id;
      }
    }

    if (!workspaceId) {
      return NextResponse.json(
        { success: false, error: 'No active workspace found' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { ids, action } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'IDs array is required' },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action is required' },
        { status: 400 }
      );
    }

    // Convert string IDs to workspace scoped references.
    // contracts table has primary key id (string).
    if (action === 'activate') {
      await db
        .update(schema.contracts)
        .set({ status: 'Active', updatedAt: new Date() })
        .where(and(eq(schema.contracts.workspaceId, workspaceId), inArray(schema.contracts.id, ids)));
    } else if (action === 'pause') {
      await db
        .update(schema.contracts)
        .set({ status: 'Paused', updatedAt: new Date() })
        .where(and(eq(schema.contracts.workspaceId, workspaceId), inArray(schema.contracts.id, ids)));
    } else if (action === 'cancel') {
      await db
        .update(schema.contracts)
        .set({ status: 'Canceled', updatedAt: new Date() })
        .where(and(eq(schema.contracts.workspaceId, workspaceId), inArray(schema.contracts.id, ids)));
    } else if (action === 'delete') {
      await db
        .delete(schema.contracts)
        .where(and(eq(schema.contracts.workspaceId, workspaceId), inArray(schema.contracts.id, ids)));
    } else {
      return NextResponse.json(
        { success: false, error: `Invalid action: ${action}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Bulk action '${action}' completed successfully on ${ids.length} subscriptions.`,
    });
  } catch (err) {
    console.error('Error in POST /api/v1/subscriptions/bulk:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
