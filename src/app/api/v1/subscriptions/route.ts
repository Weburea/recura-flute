import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getSession } from '@/lib/session';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
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

    // Join with customers to get customer details
    const subscriptionsList = await db
      .select({
        id: schema.contracts.id,
        workspaceId: schema.contracts.workspaceId,
        customerId: schema.contracts.customerId,
        planId: schema.contracts.planId,
        plan: schema.contracts.plan,
        status: schema.contracts.status,
        price: schema.contracts.price,
        interval: schema.contracts.interval,
        lastPaymentAt: schema.contracts.lastPaymentAt,
        nextBillingAt: schema.contracts.nextBillingAt,
        createdAt: schema.contracts.createdAt,
        updatedAt: schema.contracts.updatedAt,
        customer: {
          id: schema.customers.id,
          name: schema.customers.name,
          email: schema.customers.email,
          avatarUrl: schema.customers.avatarUrl,
        },
      })
      .from(schema.contracts)
      .innerJoin(schema.customers, eq(schema.contracts.customerId, schema.customers.id))
      .where(eq(schema.contracts.workspaceId, workspaceId));

    return NextResponse.json({
      success: true,
      data: subscriptionsList,
    });
  } catch (err) {
    console.error('Error in GET /api/v1/subscriptions:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

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
    const { customerId, planId, status, price, interval, lastPaymentAt, nextBillingAt } = body;

    if (!customerId || price === undefined || !status) {
      return NextResponse.json(
        { success: false, error: 'Customer ID, price, and status are required' },
        { status: 400 }
      );
    }

    // Verify customer exists and belongs to this workspace
    const customers = await db
      .select()
      .from(schema.customers)
      .where(eq(schema.customers.id, customerId))
      .limit(1);

    if (customers.length === 0 || customers[0].workspaceId !== workspaceId) {
      return NextResponse.json(
        { success: false, error: 'Customer not found in this workspace' },
        { status: 404 }
      );
    }

    const contractId = `ctr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newContract = {
      id: contractId,
      workspaceId,
      customerId,
      planId: null,
      plan: planId || null,
      status,
      price: typeof price === 'number' ? price : 0,
      interval: interval || 'month',
      lastPaymentAt: lastPaymentAt ? new Date(lastPaymentAt) : null,
      nextBillingAt: nextBillingAt ? new Date(nextBillingAt) : null,
    };

    await db.insert(schema.contracts).values(newContract);

    return NextResponse.json({
      success: true,
      data: newContract,
    });
  } catch (err) {
    console.error('Error in POST /api/v1/subscriptions:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
