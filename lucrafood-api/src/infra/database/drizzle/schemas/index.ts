export * from '../enums/Unit';
export * from './accounts';
export * from './ingredients';
export * from './ingredientsPurchase';
export * from './productRecipe';
export * from './products';
export * from './relations';
export * from './store';

import * as accounts from './accounts';
import * as ingredients from './ingredients';
import * as ingredientPurchases from './ingredientsPurchase';
import * as productRecipe from './productRecipe';
import * as products from './products';
import * as relations from './relations';
import * as stores from './store';

export const schema = {
  ...accounts,
  ...ingredients,
  ...ingredientPurchases,
  ...productRecipe,
  ...products,
  ...stores,
  ...relations,
};

export type Schema = typeof schema;
