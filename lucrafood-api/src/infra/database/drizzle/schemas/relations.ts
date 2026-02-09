// src/infra/db/drizzle/relations.ts
import { relations } from 'drizzle-orm';
import { accounts } from './accounts';
import { ingredients } from './ingredients';
import { ingredientPurchases } from './ingredientsPurchase';
import { productRecipeItems } from './productRecipe';
import { products } from './products';
import { stores } from './store';

// =============
// Accounts
// =============
export const accountsRelations = relations(accounts, ({ many }) => ({
  ingredients: many(ingredients),
  stores: many(stores),
  products: many(products),
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
