import type { FastifyPluginAsync } from 'fastify';

import { Registry } from '@kernel/di/Registry';
import { fastifyPrivateRouteAdapter } from '@main/adapters/fastifyPrivateRouteAdapter';

import { AddProductRecipeController } from '@application/controllers/product/AddProductRecipeController';
import { CreateProductController } from '@application/controllers/product/CreateProductController';
import { CreateProductRecipeController } from '@application/controllers/product/CreateProductRecipeController';
import { DeleteProductController } from '@application/controllers/product/DeleteProductController';
import { DeleteProductRecipeItemController } from '@application/controllers/product/DeleteProductRecipeItemController';
import { ListProductsWithFinancialsController } from '@application/controllers/product/ListProductsWithFinancialsController';
import { ListAllProductController } from '@application/controllers/product/ListProductsWithRecipeController';
import { UpdateProductController } from '@application/controllers/product/UpdateProductController';
import { UpdateProductRecipeItemController } from '@application/controllers/product/UpdateProductRecipeItemController';
import { UpdateProductSalePriceController } from '@application/controllers/product/UpdateProductSalePriceController';

export const productRoutes: FastifyPluginAsync = async (fastify) => {
  const createProductController = Registry.getInstace().resolve(CreateProductController);
  const createProductRecipeController = Registry.getInstace().resolve(CreateProductRecipeController);
  const listProductsWithRecipe = Registry.getInstace().resolve(ListAllProductController);
  const listProductsWithFinancials = Registry.getInstace().resolve(ListProductsWithFinancialsController);
  const updateProductSalePrice = Registry.getInstace().resolve(UpdateProductSalePriceController);
  const updateProductController = Registry.getInstace().resolve(UpdateProductController);
  const deleteProductController = Registry.getInstace().resolve(DeleteProductController);
  const addProductRecipeController = Registry.getInstace().resolve(AddProductRecipeController);
  const updateProductRecipeItemController = Registry.getInstace().resolve(UpdateProductRecipeItemController);
  const deleteProductRecipeItemController = Registry.getInstace().resolve(DeleteProductRecipeItemController);

  fastify.get('/products', fastifyPrivateRouteAdapter(listProductsWithRecipe));
  fastify.get('/products/financials', fastifyPrivateRouteAdapter(listProductsWithFinancials));

  fastify.post('/products', fastifyPrivateRouteAdapter(createProductController));
  fastify.patch('/products/:productId', fastifyPrivateRouteAdapter(updateProductController));
  fastify.patch('/products/:productId/sale-price', fastifyPrivateRouteAdapter(updateProductSalePrice));
  fastify.delete('/products/:productId', fastifyPrivateRouteAdapter(deleteProductController));

  fastify.post('/products/:productId/recipe', fastifyPrivateRouteAdapter(createProductRecipeController));
  fastify.post('/products/:productId/recipe-items', fastifyPrivateRouteAdapter(addProductRecipeController));
  fastify.patch('/products/:productId/recipe-items/:recipeItemId', fastifyPrivateRouteAdapter(updateProductRecipeItemController));
  fastify.delete('/products/:productId/recipe-items/:recipeItemId', fastifyPrivateRouteAdapter(deleteProductRecipeItemController));
};
