import { Controller } from '@application/contracts/Controller';
import { CreateIngredientPurchaseUseCase } from '@application/usecases/ingredients/CreateIngredientPurchaseUseCase';
import { Injectable } from '@kernel/decorators/Injactable';
import { Schema } from '@kernel/decorators/Schema';
import { PackageUnit } from '@shared/types/PackageUnit';
import { IngredientPurchaseBody, ingredientPurchaseSchema } from './schemas/ingredientPurchaseSchema';

@Injectable()
@Schema(ingredientPurchaseSchema)
export class CreateIngredientPurchaseController extends Controller<'private', CreateIngredientPurchaseController.Response> {

  constructor(private readonly createIngredientPurchaseUseCase: CreateIngredientPurchaseUseCase) {
    super();
  }

  protected override async handle(request: CreateIngredientPurchaseController.Request): Promise<Controller.Response<CreateIngredientPurchaseController.Response>> {
    const { ingredientId } = request.params;
    const { accountId } = request;
    const { storeId, packageQty, packageUnit, totalPrice } = request.body.ingredientPurchase;

    const result = await this.createIngredientPurchaseUseCase.execute({
      accountId, ingredientId, storeId, packageQty, packageUnit, totalPrice,
    });

    return {
      statusCode: 201,
      body: result,
    };
  }
}

export namespace CreateIngredientPurchaseController {
  export type Params = {
    ingredientId: string
  }

  export type Request = Controller.Request<
    'private',
    IngredientPurchaseBody,
    CreateIngredientPurchaseController.Params
  >;

  export type Response = {
    ingredientPurchase: {
      ingredientId: string;
      storeId?: string | null;
      packageQty: number;
      packageUnit: PackageUnit;
      totalPrice: number;
      unitPrice: number;
      purchasedAt: Date
    }
  }
}
