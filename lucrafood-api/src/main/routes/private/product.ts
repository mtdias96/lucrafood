import type { FastifyPluginAsync } from 'fastify';

import { Registry } from '@kernel/di/Registry';
import { fastifyPrivateRouteAdapter } from '@main/adapters/fastifyPrivateRouteAdapter';

import { AddProductRecipeController } from '@application/controllers/product/AddProductRecipeController';
import { CreateProductController } from '@application/controllers/product/CreateProductController';
import { CreateProductRecipeController } from '@application/controllers/product/CreateProductRecipeController';
import { ListAllProductController } from '@application/controllers/product/ListProductsWithRecipeController';
import { UpdateProductSalePriceController } from '@application/controllers/product/UpdateProductSalePriceController';

export const productRoutes: FastifyPluginAsync = async (fastify) => {
  const createProductController = Registry.getInstace().resolve(CreateProductController);
  const createProductRecipeController = Registry.getInstace().resolve(CreateProductRecipeController);

  const listProductsWithRecipe = Registry.getInstace().resolve(ListAllProductController);

  const updateProductSalePrice = Registry.getInstace().resolve(UpdateProductSalePriceController);

  const addProductRecipeController = Registry.getInstace().resolve(AddProductRecipeController);

  fastify.get('/products', fastifyPrivateRouteAdapter(listProductsWithRecipe));

  fastify.post('/products', fastifyPrivateRouteAdapter(createProductController));
  fastify.post('/products/:productId/recipe', fastifyPrivateRouteAdapter(createProductRecipeController));
  fastify.post('/products/:productId/recipe-items', fastifyPrivateRouteAdapter(addProductRecipeController) );

  fastify.patch('/products/:productId/sale-price', fastifyPrivateRouteAdapter(updateProductSalePrice));
};

