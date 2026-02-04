import { pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { accountsTable } from './accounts';

export const storesTable = pgTable(
  'stores',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    accountId: uuid('account_id')
      .notNull()
      .references(() => accountsTable.id, { onDelete: 'cascade' }),

    name: text('name').notNull(),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ([
    uniqueIndex('stores_account_name_uq').on(t.accountId, t.name),
  ]),
);
