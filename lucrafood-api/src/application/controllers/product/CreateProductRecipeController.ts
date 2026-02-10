import { Controller } from '@application/contracts/Controller';
import { CreateProductRecipeUseCase } from '@application/usecases/product/CreateProductRecipeUseCase';
import { Injectable } from '@kernel/decorators/Injactable';
import { Schema } from '@kernel/decorators/Schema';
import { PackageUnit } from '@shared/types/PackageUnit';
import { ProductRecipeBody, productRecipeSchema } from './schemas/productRecipeSchema';

@Injectable()
@Schema(productRecipeSchema)
export class CreateProductRecipeController extends Controller<'private', CreateProductRecipeController.Response> {

  constructor(private readonly createProductRecipeUseCase: CreateProductRecipeUseCase) {
    super();
  }

  protected override async handle(request: CreateProductRecipeController.Request): Promise<Controller.Response<CreateProductRecipeController.Response>> {
    const { accountId } = request;
    const { productId } = request.params;

    const { ingredientId, quantityUsed, unitUsed } = request.body.productRecipe;

    const result = await this.createProductRecipeUseCase.execute({
      accountId,
      ingredientId,
      productId,
      quantityUsed,
      unitUsed,
    });

    return {
      statusCode: 201,
      body: result,
    };
  }
}
export namespace CreateProductRecipeController {
  export type Params = {
    productId: string;
  }

  export type Request = Controller.PrivateRequest<
    ProductRecipeBody,
    CreateProductRecipeController.Params
  >

  export type Response = {
    productRecipe: {
      id: string;
      ingredientId: string;
      productId: string;
      quantityUsed: number;
      unitUsed: PackageUnit;
      createdAt: Date;
    };
  }
}
