import { CreateProductController } from '@application/controllers/product/CreateProductController';
import { CreateProductRecipeController } from '@application/controllers/product/CreateProductRecipeController';
import { ListAllProductController } from '@application/controllers/product/ListProductsWithRecipeController';
import { Registry } from '@kernel/di/Registry';
import { fastifyPrivateRouteAdapter } from '@main/adapters/fastifyPrivateRouteAdapter';
import type { FastifyPluginAsync } from 'fastify';

export const productRoutes: FastifyPluginAsync = async (fastify) => {
  const createProductController = Registry.getInstace().resolve(CreateProductController);
  const createProductRecipeController = Registry.getInstace().resolve(CreateProductRecipeController);
  const listProductsWithRecipe = Registry.getInstace().resolve(ListAllProductController);

  fastify.get('/products', fastifyPrivateRouteAdapter(listProductsWithRecipe));

  fastify.post('/products', fastifyPrivateRouteAdapter(createProductController));
  fastify.post('/products/:productId/recipe', fastifyPrivateRouteAdapter(createProductRecipeController));
};
