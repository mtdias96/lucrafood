import type { FastifyPluginAsync } from 'fastify';

import { fastifyPrivateRouteAdapter } from '@main/adapters/fastifyPrivateRouteAdapter';
import {
  makeGetGlobalProfitHistoryController,
  makeGetIngredientPriceHistoryController,
  makeGetProductsRankingController,
} from '@main/factories/analytics';

export const analyticsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/analytics/ingredients/:ingredientId/price-history', fastifyPrivateRouteAdapter(makeGetIngredientPriceHistoryController()));
  fastify.get('/analytics/profit-history', fastifyPrivateRouteAdapter(makeGetGlobalProfitHistoryController()));
  fastify.get('/analytics/products/ranking', fastifyPrivateRouteAdapter(makeGetProductsRankingController()));
};
