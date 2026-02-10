import { numeric, pgTable, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { unitEnum } from '../enums/Unit';
import { ingredients } from './ingredients';
import { products } from './products';

export const productRecipeItems = pgTable(
  'product_recipe_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),

    ingredientId: uuid('ingredient_id')
      .notNull()
      .references(() => ingredients.id, { onDelete: 'restrict' }),

    accountId: uuid('account_id')
      .notNull()
      .references(() => ingredients.id, { onDelete: 'cascade' }),

    quantityUsed: numeric('quantity_used', { precision: 14, scale: 3 }).notNull(),
    unitUsed: unitEnum('unit_used').notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ([
    uniqueIndex('uniq_ingredient_per_product').on(
      t.productId,
      t.ingredientId,
    ),
  ]),
);
