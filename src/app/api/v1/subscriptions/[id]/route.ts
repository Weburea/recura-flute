import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getSession } from '@/lib/session';
import { eq, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
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
    const { plan, status, price, interval, nextBillingAt } = body;

    // Verify contract exists and belongs to this workspace
    const existing = await db
      .select()
      .from(schema.contracts)
      .where(and(eq(schema.contracts.id, id), eq(schema.contracts.workspaceId, workspaceId)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Subscription contract not found' },
        { status: 404 }
      );
    }

    const updateData: Partial<typeof schema.contracts.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (plan !== undefined) updateData.plan = plan;
    if (status !== undefined) updateData.status = status;
    if (price !== undefined) updateData.price = price;
    if (interval !== undefined) updateData.interval = interval;
    if (nextBillingAt !== undefined) updateData.nextBillingAt = nextBillingAt ? new Date(nextBillingAt) : null;

    await db
      .update(schema.contracts)
      .set(updateData)
      .where(and(eq(schema.contracts.id, id), eq(schema.contracts.workspaceId, workspaceId)));

    return NextResponse.json({
      success: true,
      data: { id, ...updateData },
    });
  } catch (err) {
    console.error('Error in PATCH /api/v1/subscriptions/[id]:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
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

    // Verify contract exists and belongs to this workspace
    const existing = await db
      .select()
      .from(schema.contracts)
      .where(and(eq(schema.contracts.id, id), eq(schema.contracts.workspaceId, workspaceId)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Subscription contract not found' },
        { status: 404 }
      );
    }

    await db
      .delete(schema.contracts)
      .where(and(eq(schema.contracts.id, id), eq(schema.contracts.workspaceId, workspaceId)));

    return NextResponse.json({
      success: true,
      message: 'Subscription contract deleted successfully',
    });
  } catch (err) {
    console.error('Error in DELETE /api/v1/subscriptions/[id]:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
