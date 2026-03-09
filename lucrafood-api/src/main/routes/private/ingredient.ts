import type { FastifyPluginAsync } from 'fastify';

import { fastifyPrivateRouteAdapter } from '@main/adapters/fastifyPrivateRouteAdapter';
import {
  makeCreateIngredientController,
  makeCreateIngredientPurchaseController,
  makeGetIngredientDetailController,
  makeListIngredientPurchasesController,
  makeListIngredientsController,
} from '@main/factories/ingredient';

export const ingredientsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/ingredients', fastifyPrivateRouteAdapter(makeListIngredientsController()));
  fastify.get('/ingredients/:ingredientId', fastifyPrivateRouteAdapter(makeGetIngredientDetailController()));
  fastify.get('/ingredients/:ingredientId/purchases', fastifyPrivateRouteAdapter(makeListIngredientPurchasesController()));

  fastify.post('/ingredients', fastifyPrivateRouteAdapter(makeCreateIngredientController()));
  fastify.post('/ingredients/:ingredientId/purchases', fastifyPrivateRouteAdapter(makeCreateIngredientPurchaseController()));
};
