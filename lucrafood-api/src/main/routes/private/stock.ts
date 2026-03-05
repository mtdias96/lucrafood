import type { FastifyPluginAsync } from 'fastify';

import { fastifyPrivateRouteAdapter } from '@main/adapters/fastifyPrivateRouteAdapter';
import {
  makeListStockController,
  makeProduceProductController,
  makeUpdateIngredientStockController,
  makeUpdateProductStockController,
} from '@main/factories/stock';

export const stockRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/stock', fastifyPrivateRouteAdapter(makeListStockController()));

  fastify.patch('/stock/ingredients/:ingredientId', fastifyPrivateRouteAdapter(makeUpdateIngredientStockController()));
  fastify.patch('/stock/products/:productId', fastifyPrivateRouteAdapter(makeUpdateProductStockController()));

  fastify.post('/stock/products/:productId/produce', fastifyPrivateRouteAdapter(makeProduceProductController()));
};
