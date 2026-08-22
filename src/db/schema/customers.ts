import { pgTable, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { workspaces } from './workspaces';

export const customers = pgTable('customers', {
  id: varchar('id', { length: 255 }).primaryKey(),
  workspaceId: varchar('workspace_id', { length: 255 })
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  status: text('status').default('Active').notNull(), // 'Active' | 'Trial' | 'Inactive'
  plan: text('plan'),
  avatarUrl: text('avatar_url'),
  spent: integer('spent').default(0).notNull(), // spent in cents
  currencySymbol: text('currency_symbol').default('$').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
