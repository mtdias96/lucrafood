import { numeric, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { accountsTable } from './accounts';
import { storesTable } from './stores';

export const ingredientUnitEnum = pgEnum('ingredient_unit', ['g', 'ml', 'un', 'kg', 'l']);

export const ingredientsTable = pgTable('ingredients', {
  id: uuid('id').defaultRandom().primaryKey(),
  accountId: uuid('account_id').notNull().references(() => accountsTable.id, { onDelete: 'cascade' }),

  name: text('name').notNull(),
  unit: ingredientUnitEnum('unit').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
},
  (t) => ([
    uniqueIndex('ingredients_user_name_uq').on(t.accountId, t.name),
  ]),
);

export const ingredientPrices = pgTable('ingredient_prices', {
  id: uuid('id').primaryKey().defaultRandom(),

  ingredientId: uuid('ingredient_id')
    .notNull()
    .references(() => ingredientsTable.id, { onDelete: 'cascade' }),

  storeId: uuid('store_id')
    .notNull()
    .references(() => storesTable.id, { onDelete: 'restrict' }),

  priceTotal: numeric('price_total', { precision: 12, scale: 2 }).notNull(),
  quantity: numeric('quantity', { precision: 12, scale: 3 }).notNull(),
  unitPrice: numeric('unit_price', { precision: 12, scale: 6 }).notNull(),

  purchasedAt: timestamp('purchased_at', { withTimezone: true }).notNull(),

  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
