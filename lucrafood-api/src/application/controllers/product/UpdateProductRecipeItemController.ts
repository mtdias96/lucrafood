import { Controller } from '@application/contracts/Controller';
import { UpdateProductRecipeItemUseCase } from '@application/usecases/product/UpdateProductRecipeItemUseCase';
import { Injectable } from '@kernel/decorators/Injactable';
import { Schema } from '@kernel/decorators/Schema';
import { ProductRecipeItemUpdateBody, productRecipeItemUpdateSchema } from './schemas/productRecipeItemUpdateSchema';

@Injectable()
@Schema(productRecipeItemUpdateSchema)
export class UpdateProductRecipeItemController extends Controller<
  'private',
  UpdateProductRecipeItemController.Response
> {
  constructor(private readonly updateProductRecipeItemUseCase: UpdateProductRecipeItemUseCase) {
    super();
  }

  protected override async handle({
    body,
    params,
    accountId,
  }: UpdateProductRecipeItemController.Request): Promise<
    Controller.Response<UpdateProductRecipeItemController.Response>
  > {
    const { productId, recipeItemId } = params;
    const { quantityUsed, unitUsed } = body.recipeItem;

    await this.updateProductRecipeItemUseCase.execute({
      accountId,
      productId,
      recipeItemId,
      quantityUsed,
      unitUsed,
    });

    return { statusCode: 200 };
  }
}

export namespace UpdateProductRecipeItemController {
  export type Params = { productId: string; recipeItemId: string };

  export type Request = Controller.Request<
    'private',
    ProductRecipeItemUpdateBody,
    Params
  >;

  export type Response = void;
}
