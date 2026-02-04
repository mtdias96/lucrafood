// relations.ts
import { relations } from 'drizzle-orm';
import { accountsTable } from './accounts';
import { ingredientPrices, ingredientsTable } from './ingredients';
import { storesTable } from './stores';

export const ingredientsRelations = relations(ingredientsTable, ({ one, many }) => ({
  account: one(accountsTable, {
    fields: [ingredientsTable.accountId],
    references: [accountsTable.id],
  }),
  prices: many(ingredientPrices),
}));

export const ingredientPricesRelations = relations(ingredientPrices, ({ one }) => ({
  ingredient: one(ingredientsTable, {
    fields: [ingredientPrices.ingredientId],
    references: [ingredientsTable.id],
  }),
  store: one(storesTable, {
    fields: [ingredientPrices.storeId],
    references: [storesTable.id],
  }),
}));

export const storesRelations = relations(storesTable, ({ one, many }) => ({
  account: one(accountsTable, {
    fields: [storesTable.accountId],
    references: [accountsTable.id],
  }),
  prices: many(ingredientPrices),
}));
