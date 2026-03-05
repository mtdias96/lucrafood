import type { FastifyPluginAsync } from 'fastify';

import { fastifyPrivateRouteAdapter } from '@main/adapters/fastifyPrivateRouteAdapter';
import {
  makeSimulateSalePriceController,
  makeSimulateIngredientPriceController,
} from '@main/factories/simulation';

export const simulationRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/simulation/sale-price/:productId', fastifyPrivateRouteAdapter(makeSimulateSalePriceController()));
  fastify.post('/simulation/ingredient-price/:ingredientId', fastifyPrivateRouteAdapter(makeSimulateIngredientPriceController()));
};
