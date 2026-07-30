import { pgTable, varchar, text, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: varchar('id', { length: 255 }).primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  fullName: text('full_name').notNull(),
  avatarUrl: text('avatar_url'),
  emailVerified: boolean('email_verified').default(false).notNull(),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
  role: text('role').default('owner').notNull(),
  selectedNiches: jsonb('selected_niches').$type<string[]>().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
