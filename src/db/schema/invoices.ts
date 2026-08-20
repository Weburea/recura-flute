import { pgTable, varchar, integer, timestamp, text, jsonb } from 'drizzle-orm/pg-core';
import { workspaces } from './workspaces';
import { customers } from './customers';
import { contracts } from './contracts';

export const invoices = pgTable('invoices', {
  id: varchar('id', { length: 255 }).primaryKey(),
  workspaceId: varchar('workspace_id', { length: 255 })
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  customerId: varchar('customer_id', { length: 255 })
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  contractId: varchar('contract_id', { length: 255 })
    .references(() => contracts.id, { onDelete: 'set null' }),
  amount: integer('amount').default(0).notNull(), // amount in cents
  status: text('status').default('Paid').notNull(), // 'Paid' | 'Unpaid' | 'Refund'
  dueDate: timestamp('due_date', { withTimezone: true }),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
