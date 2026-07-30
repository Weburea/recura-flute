import { pgTable, varchar, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { workspaces } from './workspaces';

export const connectedIntegrations = pgTable('connected_integrations', {
  id: varchar('id', { length: 255 }).primaryKey(),
  workspaceId: varchar('workspace_id', { length: 255 })
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(), // 'stripe' | 'paystack' | 'flutterwave' | 'monnify' | 'slack' | 'hubspot' | 'zapier'
  category: text('category').notNull(), // 'payment_gateway' | 'software_integration'
  status: text('status').default('connected').notNull(), // 'connected' | 'pending' | 'disconnected'
  credentials: jsonb('credentials').$type<Record<string, unknown>>().default({}).notNull(),
  connectedAt: timestamp('connected_at', { withTimezone: true }).defaultNow().notNull(),
});

export type ConnectedIntegration = typeof connectedIntegrations.$inferSelect;
export type NewConnectedIntegration = typeof connectedIntegrations.$inferInsert;
