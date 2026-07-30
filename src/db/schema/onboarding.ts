import { pgTable, varchar, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { profiles } from './profiles';

export const onboardingProgress = pgTable('onboarding_progress', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  currentStep: integer('current_step').default(1).notNull(), // 1 to 5
  stepData: jsonb('step_data').$type<Record<string, unknown>>().default({}).notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type OnboardingProgress = typeof onboardingProgress.$inferSelect;
export type NewOnboardingProgress = typeof onboardingProgress.$inferInsert;
