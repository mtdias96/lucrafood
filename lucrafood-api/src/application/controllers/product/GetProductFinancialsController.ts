import { Controller } from '@application/contracts/Controller';
import { GetProductFinancialsUseCase } from '@application/usecases/product/GetProductFinancialsUseCase';

import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class GetProductFinancialsController extends Controller<'private', GetProductFinancialsController.Response> {

  constructor(
    private readonly getProductFinancialsUseCase: GetProductFinancialsUseCase,
  ) {
    super();
  }

  protected override async handle({ accountId, params }: GetProductFinancialsController.Request): Promise<Controller.Response<GetProductFinancialsController.Response>> {
    const { productId } = params;

    const result = await this.getProductFinancialsUseCase.execute({
      accountId,
      productId,
    });

    return {
      statusCode: 200,
      body: result,
    };
  }
}

export namespace GetProductFinancialsController {
  export type Request = Controller.Request<
    'private',
    Record<string, unknown>,
    { productId: string }
  >;

  export type Response = GetProductFinancialsUseCase.Output;
}
