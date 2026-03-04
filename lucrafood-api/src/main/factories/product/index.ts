import { Registry } from '@kernel/di/Registry';

import { AddProductRecipeController } from '@application/controllers/product/AddProductRecipeController';
import { CreateProductController } from '@application/controllers/product/CreateProductController';
import { CreateProductRecipeController } from '@application/controllers/product/CreateProductRecipeController';
import { DeleteProductController } from '@application/controllers/product/DeleteProductController';
import { DeleteProductRecipeItemController } from '@application/controllers/product/DeleteProductRecipeItemController';
import { GetProductFinancialsController } from '@application/controllers/product/GetProductFinancialsController';
import { GetProductProfitHistoryController } from '@application/controllers/product/GetProductProfitHistoryController';
import { ListProductsWithFinancialsController } from '@application/controllers/product/ListProductsWithFinancialsController';
import { ListAllProductController } from '@application/controllers/product/ListProductsWithRecipeController';
import { UpdateProductController } from '@application/controllers/product/UpdateProductController';
import { UpdateProductRecipeItemController } from '@application/controllers/product/UpdateProductRecipeItemController';
import { UpdateProductSalePriceController } from '@application/controllers/product/UpdateProductSalePriceController';

const resolve = Registry.getInstace().resolve.bind(Registry.getInstace());

export const makeCreateProductController = () => resolve(CreateProductController);
export const makeCreateProductRecipeController = () => resolve(CreateProductRecipeController);
export const makeListProductsWithRecipeController = () => resolve(ListAllProductController);
export const makeListProductsWithFinancialsController = () => resolve(ListProductsWithFinancialsController);
export const makeUpdateProductSalePriceController = () => resolve(UpdateProductSalePriceController);
export const makeUpdateProductController = () => resolve(UpdateProductController);
export const makeDeleteProductController = () => resolve(DeleteProductController);
export const makeAddProductRecipeController = () => resolve(AddProductRecipeController);
export const makeUpdateProductRecipeItemController = () => resolve(UpdateProductRecipeItemController);
export const makeDeleteProductRecipeItemController = () => resolve(DeleteProductRecipeItemController);
export const makeGetProductFinancialsController = () => resolve(GetProductFinancialsController);
export const makeGetProductProfitHistoryController = () => resolve(GetProductProfitHistoryController);
