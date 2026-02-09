import { CreateIngredientController } from '@application/controllers/ingredients/CreateIngredientController';
import { CreateIngredientPurchaseController } from '@application/controllers/ingredients/CreateIngredientPurchaseController';
import { Registry } from '@kernel/di/Registry';
import { fastifyPrivateRouteAdapter } from '@main/adapters/fastifyPrivateRouteAdapter';
import type { FastifyPluginAsync } from 'fastify';

export const ingredientsRoutes: FastifyPluginAsync = async (fastify) => {
  const createIngredientController = Registry.getInstace().resolve(CreateIngredientController);
  const createIngredientPurchaseController = Registry.getInstace().resolve(CreateIngredientPurchaseController);

  fastify.post('/ingredients', fastifyPrivateRouteAdapter(createIngredientController));
  fastify.post('/ingredients/:ingredientId/purchases', fastifyPrivateRouteAdapter(createIngredientPurchaseController));

  fastify.post('/ingredients-stores', () => { });

  fastify.get('/ingredients/:id', () => { });
};
