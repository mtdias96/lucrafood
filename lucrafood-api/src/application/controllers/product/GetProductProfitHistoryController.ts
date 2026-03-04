import { Controller } from '@application/contracts/Controller';
import { GetProductProfitHistoryUseCase } from '@application/usecases/product/GetProductProfitHistoryUseCase';

import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class GetProductProfitHistoryController extends Controller<'private', GetProductProfitHistoryController.Response> {

  constructor(
    private readonly getProductProfitHistoryUseCase: GetProductProfitHistoryUseCase,
  ) {
    super();
  }

  protected override async handle({ accountId, params }: GetProductProfitHistoryController.Request): Promise<Controller.Response<GetProductProfitHistoryController.Response>> {
    const { productId } = params;

    const result = await this.getProductProfitHistoryUseCase.execute({
      accountId,
      productId,
    });

    return {
      statusCode: 200,
      body: result,
    };
  }
}

export namespace GetProductProfitHistoryController {
  export type Request = Controller.Request<
    'private',
    Record<string, unknown>,
    { productId: string }
  >;

  export type Response = GetProductProfitHistoryUseCase.Output;
}
