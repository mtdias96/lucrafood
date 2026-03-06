// src/infra/db/drizzle/relations.ts
import { relations } from 'drizzle-orm';
import { accounts } from './accounts';
import { alerts } from './alerts';
import { ingredients } from './ingredients';
import { ingredientPurchases } from './ingredientsPurchase';
import { ingredientStock } from './ingredientStock';

import { productRecipeItems } from './productRecipeItems';
import { products } from './products';
import { productStock } from './productStock';
import { stores } from './store';

// =============
// Accounts
// =============
export const accountsRelations = relations(accounts, ({ many }) => ({
  ingredients: many(ingredients),
  stores: many(stores),
  products: many(products),
  alerts: many(alerts),
}));

// =============
// Alerts
// =============
export const alertsRelations = relations(alerts, ({ one }) => ({
  account: one(accounts, {
    fields: [alerts.accountId],
    references: [accounts.id],
  }),
}));

// =============
// Ingredients
// =============
export const ingredientsRelations = relations(ingredients, ({ one, many }) => ({
  account: one(accounts, {
    fields: [ingredients.accountId],
    references: [accounts.id],
  }),

  recipeItems: many(productRecipeItems),

  purchases: many(ingredientPurchases),

  stock: many(ingredientStock),
}));

// =============
// Stores
// =============
export const storesRelations = relations(stores, ({ one, many }) => ({
  account: one(accounts, {
    fields: [stores.accountId],
    references: [accounts.id],
  }),

  purchases: many(ingredientPurchases),
}));

// =============
// Products
// =============
export const productsRelations = relations(products, ({ one, many }) => ({
  account: one(accounts, {
    fields: [products.accountId],
    references: [accounts.id],
  }),

  recipeItems: many(productRecipeItems),

  stock: many(productStock),
}));

// =======================
// ProductRecipeItems
// =======================
export const productRecipeItemsRelations = relations(productRecipeItems, ({ one }) => ({
  product: one(products, {
    fields: [productRecipeItems.productId],
    references: [products.id],
  }),

  ingredient: one(ingredients, {
    fields: [productRecipeItems.ingredientId],
    references: [ingredients.id],
  }),
}));

// =======================
// IngredientPurchases
// =======================
export const ingredientPurchasesRelations = relations(ingredientPurchases, ({ one }) => ({
  ingredient: one(ingredients, {
    fields: [ingredientPurchases.ingredientId],
    references: [ingredients.id],
  }),

  store: one(stores, {
    fields: [ingredientPurchases.storeId],
    references: [stores.id],
  }),
}));

// =======================
// IngredientStock
// =======================
export const ingredientStockRelations = relations(ingredientStock, ({ one }) => ({
  ingredient: one(ingredients, {
    fields: [ingredientStock.ingredientId],
    references: [ingredients.id],
  }),

  account: one(accounts, {
    fields: [ingredientStock.accountId],
    references: [accounts.id],
  }),
}));

// =======================
// ProductStock
// =======================
export const productStockRelations = relations(productStock, ({ one }) => ({
  product: one(products, {
    fields: [productStock.productId],
    references: [products.id],
  }),

  account: one(accounts, {
    fields: [productStock.accountId],
    references: [accounts.id],
  }),
}));
