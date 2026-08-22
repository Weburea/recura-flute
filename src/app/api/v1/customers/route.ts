import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getSession } from '@/lib/session';
import { eq, asc } from 'drizzle-orm';

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
        .orderBy(asc(schema.workspaces.createdAt))
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

    const customersList = await db
      .select()
      .from(schema.customers)
      .where(eq(schema.customers.workspaceId, workspaceId));

    // Fetch all invoices for this workspace to sync customer stats
    const workspaceInvoices = await db
      .select()
      .from(schema.invoices)
      .where(eq(schema.invoices.workspaceId, workspaceId));

    for (const customer of customersList) {
      const customerInvoices = workspaceInvoices.filter(inv => inv.customerId === customer.id);
      const totalSpent = customerInvoices.reduce((acc, inv) => acc + (inv.amount || 0), 0);
      
      let latestPlan = customer.plan;
      let latestDate = customer.updatedAt;
      
      if (customerInvoices.length > 0) {
        const sortedInvoices = [...customerInvoices].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const latestInv = sortedInvoices[0];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const metadata = latestInv.metadata as any;
        if (metadata?.items && Array.isArray(metadata.items) && metadata.items.length > 0) {
          latestPlan = metadata.items[0].description;
        } else {
          latestPlan = customer.plan;
        }
        latestDate = latestInv.createdAt || customer.updatedAt;
      }
      
      if (
        totalSpent !== customer.spent || 
        latestPlan !== customer.plan || 
        latestDate.getTime() !== customer.updatedAt.getTime()
      ) {
        await db
          .update(schema.customers)
          .set({
            spent: totalSpent,
            plan: latestPlan || 'Service Plan',
            updatedAt: latestDate,
          })
          .where(eq(schema.customers.id, customer.id));
          
        customer.spent = totalSpent;
        customer.plan = latestPlan || 'Service Plan';
        customer.updatedAt = latestDate;
      }
    }

    return NextResponse.json({
      success: true,
      data: customersList,
    });
  } catch (err) {
    console.error('Error in GET /api/v1/customers:', err);
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
        .orderBy(asc(schema.workspaces.createdAt))
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
    const { name, email, status, plan, avatarUrl, spent } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const customerId = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newCustomer = {
      id: customerId,
      workspaceId,
      name,
      email,
      status: status || 'Active',
      plan: plan || null,
      avatarUrl: avatarUrl || null,
      spent: typeof spent === 'number' ? spent : 0,
    };

    await db.insert(schema.customers).values(newCustomer);

    return NextResponse.json({
      success: true,
      data: newCustomer,
    });
  } catch (err) {
    console.error('Error in POST /api/v1/customers:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
