import { Controller } from '@application/contracts/Controller';
import { UpdateIngredientStockUseCase } from '@application/usecases/stock/UpdateIngredientStockUseCase';
import { Injectable } from '@kernel/decorators/Injactable';
import { Schema } from '@kernel/decorators/Schema';
import { stockUpdateSchema, StockUpdateBody } from './schemas/stockUpdateSchema';

@Injectable()
@Schema(stockUpdateSchema)
export class UpdateIngredientStockController extends Controller<'private', UpdateIngredientStockController.Response> {

  constructor(
    private readonly updateIngredientStockUseCase: UpdateIngredientStockUseCase,
  ) {
    super();
  }

  protected override async handle({ accountId, params, body }: UpdateIngredientStockController.Request): Promise<Controller.Response<UpdateIngredientStockController.Response>> {
    const { ingredientId } = params;
    const { currentQty, minQty, unit } = body.stock;

    const result = await this.updateIngredientStockUseCase.execute({
      accountId,
      ingredientId,
      currentQty,
      minQty,
      unit,
    });

    return {
      statusCode: 200,
      body: result,
    };
  }
}

export namespace UpdateIngredientStockController {
  export type Request = Controller.Request<
    'private',
    StockUpdateBody,
    { ingredientId: string }
  >;

  export type Response = UpdateIngredientStockUseCase.Output;
}
