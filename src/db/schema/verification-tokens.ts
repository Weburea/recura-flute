import { pgTable, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const verificationTokens = pgTable('verification_tokens', {
  id: varchar('id', { length: 255 }).primaryKey(),
  identifier: text('identifier').notNull(), // Target email address
  code: text('code').notNull(), // Hashed 6-digit OTP code
  type: text('type').notNull(), // 'email_verification' | 'password_reset'
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  attempts: integer('attempts').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type VerificationToken = typeof verificationTokens.$inferSelect;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;
