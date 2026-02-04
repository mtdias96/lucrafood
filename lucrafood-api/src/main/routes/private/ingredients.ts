import { CreateIngredientController } from '@application/controllers/ingredients/CreateIngredientController';
import { Registry } from '@kernel/di/Registry';
import { fastifyPrivateRouteAdapter } from '@main/adapters/fastifyPrivateRouteAdapter';
import type { FastifyPluginAsync } from 'fastify';

export const ingredientsRoutes: FastifyPluginAsync = async (fastify) => {
  const createIngredientController = Registry.getInstace().resolve(CreateIngredientController);

  fastify.post('/ingredients', fastifyPrivateRouteAdapter(createIngredientController));
};
