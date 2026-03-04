import type { FastifyPluginAsync } from 'fastify';

import { fastifyPrivateRouteAdapter } from '@main/adapters/fastifyPrivateRouteAdapter';
import {
  makeAddProductRecipeController,
  makeCreateProductController,
  makeCreateProductRecipeController,
  makeDeleteProductController,
  makeDeleteProductRecipeItemController,
  makeGetProductFinancialsController,
  makeGetProductProfitHistoryController,
  makeListProductsWithFinancialsController,
  makeListProductsWithRecipeController,
  makeUpdateProductController,
  makeUpdateProductRecipeItemController,
  makeUpdateProductSalePriceController,
} from '@main/factories/product';

export const productRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/products', fastifyPrivateRouteAdapter(makeListProductsWithRecipeController()));
  fastify.get('/products/financials', fastifyPrivateRouteAdapter(makeListProductsWithFinancialsController()));
  fastify.get('/products/:productId/financials', fastifyPrivateRouteAdapter(makeGetProductFinancialsController()));
  fastify.get('/products/:productId/profit-history', fastifyPrivateRouteAdapter(makeGetProductProfitHistoryController()));

  fastify.post('/products', fastifyPrivateRouteAdapter(makeCreateProductController()));
  fastify.patch('/products/:productId', fastifyPrivateRouteAdapter(makeUpdateProductController()));
  fastify.patch('/products/:productId/sale-price', fastifyPrivateRouteAdapter(makeUpdateProductSalePriceController()));
  fastify.delete('/products/:productId', fastifyPrivateRouteAdapter(makeDeleteProductController()));

  fastify.post('/products/:productId/recipe', fastifyPrivateRouteAdapter(makeCreateProductRecipeController()));
  fastify.post('/products/:productId/recipe-items', fastifyPrivateRouteAdapter(makeAddProductRecipeController()));
  fastify.patch('/products/:productId/recipe-items/:recipeItemId', fastifyPrivateRouteAdapter(makeUpdateProductRecipeItemController()));
  fastify.delete('/products/:productId/recipe-items/:recipeItemId', fastifyPrivateRouteAdapter(makeDeleteProductRecipeItemController()));
};
