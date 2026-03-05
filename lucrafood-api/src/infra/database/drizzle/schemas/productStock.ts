import { numeric, pgTable, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { unitEnum } from '../enums/Unit';
import { accounts } from './accounts';
import { products } from './products';

export const productStock = pgTable(
  'product_stock',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),

    accountId: uuid('account_id')
      .notNull()
      .references(() => accounts.id, { onDelete: 'cascade' }),

    currentQty: numeric('current_qty', { precision: 14, scale: 3 }).notNull().default('0'),
    minQty: numeric('min_qty', { precision: 14, scale: 3 }).notNull().default('0'),
    unit: unitEnum('unit').notNull(),

    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ([
    uniqueIndex('uniq_stock_per_product').on(t.productId, t.accountId),
  ]),
);
