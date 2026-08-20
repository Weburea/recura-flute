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

    if (action === 'mark_paid') {
      await db
        .update(schema.invoices)
        .set({ status: 'Paid', paidAt: new Date(), updatedAt: new Date() })
        .where(and(eq(schema.invoices.workspaceId, workspaceId), inArray(schema.invoices.id, ids)));
    } else if (action === 'mark_overdue') {
      await db
        .update(schema.invoices)
        .set({ status: 'Overdue', updatedAt: new Date() })
        .where(and(eq(schema.invoices.workspaceId, workspaceId), inArray(schema.invoices.id, ids)));
    } else if (action === 'delete') {
      await db
        .delete(schema.invoices)
        .where(and(eq(schema.invoices.workspaceId, workspaceId), inArray(schema.invoices.id, ids)));
    } else {
      return NextResponse.json(
        { success: false, error: `Invalid action: ${action}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Bulk action '${action}' completed successfully on ${ids.length} billing records.`,
    });
  } catch (err) {
    console.error('Error in POST /api/v1/billing/bulk:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
