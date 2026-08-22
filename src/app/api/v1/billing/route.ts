import { NextResponse } from 'next/server';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { getSession } from '@/lib/session';
import { eq, asc, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

async function syncCustomerFromInvoices(customerId: string) {
  try {
    const invoices = await db
      .select()
      .from(schema.invoices)
      .where(eq(schema.invoices.customerId, customerId))
      .orderBy(desc(schema.invoices.createdAt));

    const totalCents = invoices.reduce((acc, inv) => acc + (inv.amount || 0), 0);

    let latestPlan = null;
    let latestDate = new Date();
    if (invoices.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const metadata = invoices[0].metadata as any;
      if (metadata?.items && Array.isArray(metadata.items) && metadata.items.length > 0) {
        latestPlan = metadata.items[0].description;
      }
      latestDate = invoices[0].createdAt || new Date();
    }

    await db
      .update(schema.customers)
      .set({
        spent: totalCents,
        plan: latestPlan || 'Service Plan',
        updatedAt: latestDate,
      })
      .where(eq(schema.customers.id, customerId));
  } catch (err) {
    console.error(`[SYNC CUSTOMER ERROR] Failed to sync customer ${customerId}:`, err);
  }
}

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

    // Join with customers to get customer details
    const invoicesList = await db
      .select({
        id: schema.invoices.id,
        workspaceId: schema.invoices.workspaceId,
        customerId: schema.invoices.customerId,
        contractId: schema.invoices.contractId,
        amount: schema.invoices.amount,
        status: schema.invoices.status,
        dueDate: schema.invoices.dueDate,
        paidAt: schema.invoices.paidAt,
        metadata: schema.invoices.metadata,
        createdAt: schema.invoices.createdAt,
        updatedAt: schema.invoices.updatedAt,
        customer: {
          id: schema.customers.id,
          name: schema.customers.name,
          email: schema.customers.email,
          avatarUrl: schema.customers.avatarUrl,
          plan: schema.customers.plan,
        },
      })
      .from(schema.invoices)
      .innerJoin(schema.customers, eq(schema.invoices.customerId, schema.customers.id))
      .where(eq(schema.invoices.workspaceId, workspaceId));

    return NextResponse.json({
      success: true,
      data: invoicesList,
    });
  } catch (err) {
    console.error('Error in GET /api/v1/billing:', err);
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
    const { customerId, contractId, amount, status, dueDate, paidAt } = body;

    if (!customerId || amount === undefined || !status) {
      return NextResponse.json(
        { success: false, error: 'Customer ID, amount, and status are required' },
        { status: 400 }
      );
    }

    let finalCustomerId = customerId;
    
    if (customerId === "new") {
      const { newCustomer } = body;
      if (!newCustomer || !newCustomer.name || !newCustomer.email) {
        return NextResponse.json(
          { success: false, error: 'New customer name and email are required' },
          { status: 400 }
        );
      }
      finalCustomerId = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      
      const customerRecord = {
        id: finalCustomerId,
        workspaceId,
        name: newCustomer.name,
        email: newCustomer.email,
        status: 'Active',
        plan: newCustomer.plan || 'Service Retainer',
        avatarUrl: newCustomer.avatarUrl || null,
        spent: 0,
      };
      
      await db.insert(schema.customers).values(customerRecord);
    } else {
      // Verify customer exists and belongs to this workspace
      const existingCustomers = await db
        .select()
        .from(schema.customers)
        .where(eq(schema.customers.id, customerId))
        .limit(1);

      if (existingCustomers.length === 0 || existingCustomers[0].workspaceId !== workspaceId) {
        return NextResponse.json(
          { success: false, error: 'Customer not found in this workspace' },
          { status: 404 }
        );
      }
    }

    const parseSafeDate = (d: string | number | Date | null | undefined) => {
      if (!d) return null;
      const parsed = new Date(d);
      if (isNaN(parsed.getTime())) return null;
      return parsed;
    };

    const invoiceId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newInvoice = {
      id: invoiceId,
      workspaceId,
      customerId: finalCustomerId,
      contractId: contractId || null,
      amount: typeof amount === 'number' ? amount : 0,
      status,
      dueDate: parseSafeDate(dueDate),
      paidAt: parseSafeDate(paidAt),
      metadata: body.metadata || {},
    };

    await db.insert(schema.invoices).values(newInvoice);
    await syncCustomerFromInvoices(finalCustomerId);

    return NextResponse.json({
      success: true,
      data: newInvoice,
    });
  } catch (err) {
    console.error('Error in POST /api/v1/billing:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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
    const { id, status, amount, dueDate, metadata } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    // Verify invoice belongs to this workspace
    const invoicesList = await db
      .select()
      .from(schema.invoices)
      .where(eq(schema.invoices.id, id))
      .limit(1);

    if (invoicesList.length === 0 || invoicesList[0].workspaceId !== workspaceId) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found in this workspace' },
        { status: 404 }
      );
    }

    const targetInvoice = invoicesList[0];
    const updates: Record<string, unknown> = {};

    if (status !== undefined) updates.status = status;
    if (amount !== undefined) updates.amount = amount;
    if (dueDate !== undefined) updates.dueDate = dueDate ? new Date(dueDate) : null;
    if (metadata !== undefined) {
      updates.metadata = {
        ...(targetInvoice.metadata || {}),
        ...metadata,
      };
    }

    await db
      .update(schema.invoices)
      .set(updates)
      .where(eq(schema.invoices.id, id));
    await syncCustomerFromInvoices(targetInvoice.customerId);

    return NextResponse.json({
      success: true,
      message: 'Invoice updated successfully.',
    });
  } catch (err) {
    console.error('Error in PUT /api/v1/billing:', err);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
