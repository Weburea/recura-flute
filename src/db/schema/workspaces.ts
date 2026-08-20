import { pgTable, varchar, text, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { profiles } from './profiles';
import { plans } from './plans';

export const workspaces = pgTable('workspaces', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  ownerId: varchar('owner_id', { length: 255 })
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  planId: varchar('plan_id', { length: 255 })
    .references(() => plans.id, { onDelete: 'set null' }),
  businessType: text('business_type').notNull(), // 'saas' | 'agencies' | 'social_media' | 'startups' | 'marketplaces'
  niche: text('niche'), // e.g. 'gym', 'design_agency', 'fitness_studio'
  currency: text('currency').default('USD').notNull(),
  timezone: text('timezone').default('UTC').notNull(),
  onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
  apiKey: text('api_key').unique(),
  settings: jsonb('settings').$type<Record<string, unknown>>().default({}),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
