import { pgTable, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { workspaces } from './workspaces';
import { customers } from './customers';
import { plans } from './plans';

export const contracts = pgTable('contracts', {
  id: varchar('id', { length: 255 }).primaryKey(),
  workspaceId: varchar('workspace_id', { length: 255 })
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  customerId: varchar('customer_id', { length: 255 })
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  planId: varchar('plan_id', { length: 255 })
    .references(() => plans.id, { onDelete: 'set null' }),
  plan: text('plan'),
  status: text('status').default('Active').notNull(), // 'Active' | 'Trial' | 'Paused' | 'Canceled'
  price: integer('price').default(0).notNull(), // price/retainer in cents
  interval: text('interval').default('month').notNull(), // 'month' | 'year' | 'one_time'
  lastPaymentAt: timestamp('last_payment_at', { withTimezone: true }),
  nextBillingAt: timestamp('next_billing_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Contract = typeof contracts.$inferSelect;
export type NewContract = typeof contracts.$inferInsert;
