import { pgTable, varchar, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const plans = pgTable('plans', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  description: text('description'),
  features: jsonb('features').$type<string[]>().default([]),
  priceMonthly: integer('price_monthly').default(0).notNull(),
  priceYearly: integer('price_yearly').default(0).notNull(),
  nicheCompatibility: jsonb('niche_compatibility').$type<string[]>().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;
