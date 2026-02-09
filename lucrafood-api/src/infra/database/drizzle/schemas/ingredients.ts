
import { pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { unitEnum } from '../enums/Unit';
import { accounts } from './accounts';

export const ingredients = pgTable(
  'ingredients',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    accountId: uuid('account_id')
      .notNull()
      .references(() => accounts.id, { onDelete: 'cascade' }),

    name: text('name').notNull(),

    baseUnit: unitEnum('base_unit').notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ([
    uniqueIndex('uniq_ingredient_name_by_account').on(
      t.accountId,
      t.name,
    ),
  ]),
);
