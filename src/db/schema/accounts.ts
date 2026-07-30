import { pgTable, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { profiles } from './profiles';

export const accounts = pgTable('accounts', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(), // 'google' | 'github'
  providerAccountId: text('provider_account_id').notNull(),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: integer('expires_at'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
