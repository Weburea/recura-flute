import { db } from '../src/db';
import * as schema from '../src/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log("Simulating POST /api/v1/billing request...");
  try {
    // 1. Get first workspace
    const workspace = await db.select().from(schema.workspaces).limit(1);
    if (workspace.length === 0) {
      console.error("No workspaces found");
      return;
    }
    const workspaceId = workspace[0].id;
    console.log("Using workspaceId:", workspaceId);

    // 2. Mock payload with a new customer
    const customerId = "new";
    const amount = 10500; // $105.00
    const status = "Unpaid";
    const dueDate = new Date("2026-08-22").toISOString();
    
    const newCustomer = {
      name: "Gocardless",
      email: "team@gocardless.com",
      avatarUrl: null,
      plan: 'Custom Service Plan'
    };

    const metadataPayload = {
      customerName: "Gocardless",
      customerEmail: "team@gocardless.com",
      customerLogo: null,
      customerAddress: "Sliverponit NO,4 Lagos Ajha, Nigeria",
      customerPhone: "+234 2348100874728",
      invoiceNumber: "INV_4721_180826_WEB",
      issuedDate: "2026-08-18",
      currency: "USD",
      currencySymbol: "$",
      terms: "Fees and payment terms will be established...",
      items: [
        { id: 1, description: "Product Subscription - Monthly Retainer", qty: 2, price: 30, total: 60 },
        { id: 2, description: "Facebook Ads", qty: 1, price: 20, total: 20 },
        { id: 3, description: "Instagram Ads", qty: 1, price: 25, total: 25 }
      ],
      subtotal: 105,
      tax: 0,
      discount: 0,
    };

    // Simulate backend route POST logic
    let finalCustomerId = customerId;
    if (customerId === "new") {
      finalCustomerId = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const customerRecord = {
        id: finalCustomerId,
        workspaceId,
        name: newCustomer.name,
        email: newCustomer.email,
        status: 'Active' as const,
        plan: newCustomer.plan || 'Service Retainer',
        avatarUrl: newCustomer.avatarUrl || null,
        spent: 0,
      };
      
      console.log("Inserting customer record...");
      await db.insert(schema.customers).values(customerRecord);
      console.log("Customer inserted successfully with ID:", finalCustomerId);
    }

    const invoiceId = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newInvoice = {
      id: invoiceId,
      workspaceId,
      customerId: finalCustomerId,
      contractId: null,
      amount: amount,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
      paidAt: null,
      metadata: metadataPayload,
    };

    console.log("Inserting invoice record...");
    await db.insert(schema.invoices).values(newInvoice);
    console.log("Invoice inserted successfully with ID:", invoiceId);

  } catch (err) {
    console.error("Simulation failed:", err);
  }
}

main();
