import { integer, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { unitEnum } from '../enums/Unit';
import { accounts } from './accounts';

export const products = pgTable(
  'products',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    accountId: uuid('account_id')
      .notNull()
      .references(() => accounts.id, { onDelete: 'cascade' }),

    name: text('name').notNull(),

    yieldQty: integer('yield_qty').notNull().default(1),
    yieldUnit: unitEnum('yield_unit').notNull().default('un'),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ([
    uniqueIndex('uniq_product_name_by_account').on(t.accountId, t.name),
  ]),
);
