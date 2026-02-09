import { numeric, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { unitEnum } from '../enums/Unit';
import { ingredients } from './ingredients';
import { stores } from './store';

export const ingredientPurchases = pgTable('ingredient_purchases', {
  id: uuid('id').primaryKey().defaultRandom(),

  ingredientId: uuid('ingredient_id')
    .notNull()
    .references(() => ingredients.id, { onDelete: 'cascade' }),

  storeId: uuid('store_id')
    .references(() => stores.id, { onDelete: 'restrict' }),

  packageQty: numeric('package_qty', { precision: 14, scale: 3 }).notNull(),
  packageUnit: unitEnum('package_unit').notNull(),

  totalPrice: numeric('total_price', { precision: 14, scale: 2 }).notNull(),
  unitPrice: numeric('unit_price', { precision: 14, scale: 6 }).notNull(),

  purchasedAt: timestamp('purchased_at', { withTimezone: true }).notNull().defaultNow(),
});
