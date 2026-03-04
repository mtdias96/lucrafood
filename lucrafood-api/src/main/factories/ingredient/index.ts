import { Registry } from '@kernel/di/Registry';

import { CreateIngredientController } from '@application/controllers/ingredients/CreateIngredientController';
import { CreateIngredientPurchaseController } from '@application/controllers/ingredients/CreateIngredientPurchaseController';
import { GetIngredientDetailController } from '@application/controllers/ingredients/GetIngredientDetailController';
import { ListIngredientPurchasesController } from '@application/controllers/ingredients/ListIngredientPurchasesController';
import { ListIngredientsController } from '@application/controllers/ingredients/ListIngredientsController';

const resolve = Registry.getInstace().resolve.bind(Registry.getInstace());

export const makeCreateIngredientController = () => resolve(CreateIngredientController);
export const makeCreateIngredientPurchaseController = () => resolve(CreateIngredientPurchaseController);
export const makeListIngredientsController = () => resolve(ListIngredientsController);
export const makeGetIngredientDetailController = () => resolve(GetIngredientDetailController);
export const makeListIngredientPurchasesController = () => resolve(ListIngredientPurchasesController);
