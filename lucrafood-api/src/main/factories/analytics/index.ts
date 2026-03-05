import { Registry } from '@kernel/di/Registry';

import { GetGlobalProfitHistoryController } from '@application/controllers/analytics/GetGlobalProfitHistoryController';
import { GetIngredientPriceHistoryController } from '@application/controllers/analytics/GetIngredientPriceHistoryController';
import { GetProductsRankingController } from '@application/controllers/analytics/GetProductsRankingController';

const resolve = Registry.getInstace().resolve.bind(Registry.getInstace());

export const makeGetIngredientPriceHistoryController = () => resolve(GetIngredientPriceHistoryController);
export const makeGetGlobalProfitHistoryController = () => resolve(GetGlobalProfitHistoryController);
export const makeGetProductsRankingController = () => resolve(GetProductsRankingController);
