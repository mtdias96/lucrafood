import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const accountsTable = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  passowrd_hashed: text('passwordHash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
