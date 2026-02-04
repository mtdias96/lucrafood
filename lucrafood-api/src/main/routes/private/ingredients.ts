import { CreateIngredientController } from '@application/controllers/ingredients/CreateIngredientController';
import { CreateIngredientStoreController } from '@application/controllers/ingredients/CreateIngredientStoreController';
import { Registry } from '@kernel/di/Registry';
import { fastifyPrivateRouteAdapter } from '@main/adapters/fastifyPrivateRouteAdapter';
import type { FastifyPluginAsync } from 'fastify';

export const ingredientsRoutes: FastifyPluginAsync = async (fastify) => {
  const createIngredientController = Registry.getInstace().resolve(CreateIngredientController);
  const createIngredientStoreController = Registry.getInstace().resolve(CreateIngredientStoreController);

  fastify.post('/ingredients', fastifyPrivateRouteAdapter(createIngredientController));
  fastify.post('/ingredients-stores', fastifyPrivateRouteAdapter(createIngredientStoreController));
};
