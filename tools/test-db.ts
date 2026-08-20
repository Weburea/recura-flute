import { db } from '../src/db';
import * as schema from '../src/db/schema';

async function main() {
  console.log("Connecting and querying database...");
  try {
    const workspaces = await db.select().from(schema.workspaces).limit(1);
    console.log("Workspaces:", workspaces);
    
    const customers = await db.select().from(schema.customers).limit(1);
    console.log("Customers:", customers);

    const invoices = await db.select().from(schema.invoices).limit(1);
    console.log("Invoices:", invoices);
  } catch (err) {
    console.error("Database connection/query failed:", err);
  }
}

main();
