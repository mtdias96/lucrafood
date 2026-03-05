import { numeric, pgTable, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { unitEnum } from '../enums/Unit';
import { accounts } from './accounts';
import { ingredients } from './ingredients';

export const ingredientStock = pgTable(
  'ingredient_stock',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    ingredientId: uuid('ingredient_id')
      .notNull()
      .references(() => ingredients.id, { onDelete: 'cascade' }),

    accountId: uuid('account_id')
      .notNull()
      .references(() => accounts.id, { onDelete: 'cascade' }),

    currentQty: numeric('current_qty', { precision: 14, scale: 3 }).notNull().default('0'),
    minQty: numeric('min_qty', { precision: 14, scale: 3 }).notNull().default('0'),
    unit: unitEnum('unit').notNull(),

    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ([
    uniqueIndex('uniq_stock_per_ingredient').on(t.ingredientId, t.accountId),
  ]),
);
