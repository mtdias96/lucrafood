import { CreateIngredientController } from '@application/controllers/ingredients/CreateIngredientController';
import { CreateIngredientPurchaseController } from '@application/controllers/ingredients/CreateIngredientPurchaseController';
import { GetIngredientDetailController } from '@application/controllers/ingredients/GetIngredientDetailController';
import { ListIngredientPurchasesController } from '@application/controllers/ingredients/ListIngredientPurchasesController';
import { ListIngredientsController } from '@application/controllers/ingredients/ListIngredientsController';
import { Registry } from '@kernel/di/Registry';
import { fastifyPrivateRouteAdapter } from '@main/adapters/fastifyPrivateRouteAdapter';
import type { FastifyPluginAsync } from 'fastify';

export const ingredientsRoutes: FastifyPluginAsync = async (fastify) => {
  const createIngredientController = Registry.getInstace().resolve(CreateIngredientController);
  const createIngredientPurchaseController = Registry.getInstace().resolve(CreateIngredientPurchaseController);
  const listIngredientsController = Registry.getInstace().resolve(ListIngredientsController);
  const getIngredientDetailController = Registry.getInstace().resolve(GetIngredientDetailController);
  const listIngredientPurchasesController = Registry.getInstace().resolve(ListIngredientPurchasesController);

  fastify.get('/ingredients', fastifyPrivateRouteAdapter(listIngredientsController));
  fastify.get('/ingredients/:ingredientId', fastifyPrivateRouteAdapter(getIngredientDetailController));
  fastify.get('/ingredients/:ingredientId/purchases', fastifyPrivateRouteAdapter(listIngredientPurchasesController));

  fastify.post('/ingredients', fastifyPrivateRouteAdapter(createIngredientController));
  fastify.post('/ingredients/:ingredientId/purchases', fastifyPrivateRouteAdapter(createIngredientPurchaseController));

  fastify.post('/ingredients-stores', () => { });
};
