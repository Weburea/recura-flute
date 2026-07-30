import { pgTable, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { profiles } from './profiles';
import { workspaces } from './workspaces';

export const userWorkspaces = pgTable('user_workspaces', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  workspaceId: varchar('workspace_id', { length: 255 })
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  role: text('role').default('owner').notNull(), // 'owner' | 'admin' | 'member'
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
});

export type UserWorkspace = typeof userWorkspaces.$inferSelect;
export type NewUserWorkspace = typeof userWorkspaces.$inferInsert;
