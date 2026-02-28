import { Controller } from '@application/contracts/Controller';
import { AddProductRecipeUseCase } from '@application/usecases/product/AddProductRecipeUseCase';
import { Injectable } from '@kernel/decorators/Injactable';
import { Schema } from '@kernel/decorators/Schema';
import { PackageUnit } from '@shared/types/PackageUnit';
import { ProductRecipeBody, productRecipeSchema } from './schemas/productRecipeSchema';

@Injectable()
@Schema(productRecipeSchema)
export class AddProductRecipeController extends Controller<'private', AddProductRecipeController.Response> {

  constructor(private readonly addProductRecipeUseCase: AddProductRecipeUseCase) {
    super();
  }

  protected override async handle(request: AddProductRecipeController.Request): Promise<Controller.Response<AddProductRecipeController.Response>> {
    const { accountId } = request;
    const { productId } = request.params;

    const { productRecipe } = request.body;

    const result = await this.addProductRecipeUseCase.execute(
      { accountId, productId, productRecipe },
    );

    return {
      statusCode: 201,
      body: result,
    };
  }
}
export namespace AddProductRecipeController {
  export type Params = {
    productId: string;
  }

  export type Request = Controller.PrivateRequest<
    ProductRecipeBody,
    AddProductRecipeController.Params
  >

  export type Response = {
    id: string;
    ingredientId: string;
    productId: string;
    quantityUsed: string;
    accountId: string;
    unitUsed: PackageUnit
  }[]
}
