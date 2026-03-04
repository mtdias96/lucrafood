import { Controller } from '@application/contracts/Controller';
import { DeleteProductRecipeItemUseCase } from '@application/usecases/product/DeleteProductRecipeItemUseCase';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class DeleteProductRecipeItemController extends Controller<
  'private',
  DeleteProductRecipeItemController.Response
> {
  constructor(private readonly deleteProductRecipeItemUseCase: DeleteProductRecipeItemUseCase) {
    super();
  }

  protected override async handle({
    params,
    accountId,
  }: DeleteProductRecipeItemController.Request): Promise<
    Controller.Response<DeleteProductRecipeItemController.Response>
  > {
    const { productId, recipeItemId } = params;

    await this.deleteProductRecipeItemUseCase.execute({ accountId, productId, recipeItemId });

    return { statusCode: 204 };
  }
}

export namespace DeleteProductRecipeItemController {
  export type Params = { productId: string; recipeItemId: string };

  export type Request = Controller.Request<
    'private',
    Record<string, unknown>,
    Params
  >;

  export type Response = void;
}
