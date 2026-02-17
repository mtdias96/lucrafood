import { Controller } from '@application/contracts/Controller';
import { ListProductsWithRecipeUseCase } from '@application/usecases/product/ListProductsWithRecipeUseCase';

import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class ListAllProductController extends Controller<'private', ListAllProductController.Response> {

  constructor(private readonly listProductsWithRecipe: ListProductsWithRecipeUseCase) {
    super();
  }

  protected override async handle({ accountId, queryParams }: ListAllProductController.Request): Promise<Controller.Response<ListAllProductController.Response>> {
    const { limit, page } = queryParams;

    const productWithRecipe = await this.listProductsWithRecipe.execute({
      accountId,
      page,
      limit,
    });

    return {
      statusCode: 200,
      body: productWithRecipe,
    };
  }
}

export namespace ListAllProductController {
  export type QueryParams = {
    page?: number;
    limit?: number
  }

  export type Request = Controller.Request<
    'private',
    Record<string, unknown>,
    Record<string, string>,
    ListAllProductController.QueryParams
  >

  export type Response = {
    products: {
      id: string;
      name: string;
      yieldQty: number;
      yieldUnit: string;
      createdAt: Date;
      items: Array<{
        ingredientId: string;
        ingredientName: string | null;
        quantity: string;
        unit: string;
      }>;
    }[],
    meta: {
      page: number;
      limit: number;
      pageItems: number
      totalPages: number
      totalProducts: number
    }
  }
}
