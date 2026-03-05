import { Registry } from '@kernel/di/Registry';

import { ListStockController } from '@application/controllers/stock/ListStockController';
import { ProduceProductController } from '@application/controllers/stock/ProduceProductController';
import { UpdateIngredientStockController } from '@application/controllers/stock/UpdateIngredientStockController';
import { UpdateProductStockController } from '@application/controllers/stock/UpdateProductStockController';

const resolve = Registry.getInstace().resolve.bind(Registry.getInstace());

export const makeListStockController = () => resolve(ListStockController);
export const makeUpdateIngredientStockController = () => resolve(UpdateIngredientStockController);
export const makeUpdateProductStockController = () => resolve(UpdateProductStockController);
export const makeProduceProductController = () => resolve(ProduceProductController);
