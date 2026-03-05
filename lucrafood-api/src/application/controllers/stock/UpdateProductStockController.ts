import { Controller } from '@application/contracts/Controller';
import { UpdateProductStockUseCase } from '@application/usecases/stock/UpdateProductStockUseCase';
import { Injectable } from '@kernel/decorators/Injactable';
import { Schema } from '@kernel/decorators/Schema';
import { stockUpdateSchema, StockUpdateBody } from './schemas/stockUpdateSchema';

@Injectable()
@Schema(stockUpdateSchema)
export class UpdateProductStockController extends Controller<'private', UpdateProductStockController.Response> {

  constructor(
    private readonly updateProductStockUseCase: UpdateProductStockUseCase,
  ) {
    super();
  }

  protected override async handle({ accountId, params, body }: UpdateProductStockController.Request): Promise<Controller.Response<UpdateProductStockController.Response>> {
    const { productId } = params;
    const { currentQty, minQty, unit } = body.stock;

    const result = await this.updateProductStockUseCase.execute({
      accountId,
      productId,
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

export namespace UpdateProductStockController {
  export type Request = Controller.Request<
    'private',
    StockUpdateBody,
    { productId: string }
  >;

  export type Response = UpdateProductStockUseCase.Output;
}
