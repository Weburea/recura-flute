import { db } from './index';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('Starting sync of customer spent/plan values with contracts...');
  
  // Fetch all contracts
  const contractsList = await db.select().from(schema.contracts);
  
  for (const contract of contractsList) {
    if (contract.customerId) {
      console.log(`Syncing customer ${contract.customerId} with contract plan: ${contract.plan}, price: ${contract.price}`);
      await db.update(schema.customers)
        .set({
          spent: contract.price,
          plan: contract.plan || null,
        })
        .where(eq(schema.customers.id, contract.customerId));
    }
  }
  
  console.log('Sync completed!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
