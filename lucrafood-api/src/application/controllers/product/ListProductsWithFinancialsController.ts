import { Controller } from '@application/contracts/Controller';
import { ListProductsWithFinancialsUseCase } from '@application/usecases/product/ListProductsWithFinancialsUseCase';

import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class ListProductsWithFinancialsController extends Controller<'private', ListProductsWithFinancialsController.Response> {

  constructor(
    private readonly listProductsWithFinancialsUseCase: ListProductsWithFinancialsUseCase,
  ) {
    super();
  }

  protected override async handle({ accountId, queryParams }: ListProductsWithFinancialsController.Request): Promise<Controller.Response<ListProductsWithFinancialsController.Response>> {
    const page = queryParams.page !== undefined ? Number(queryParams.page) : undefined;
    const limit = queryParams.limit !== undefined ? Number(queryParams.limit) : undefined;

    const result = await this.listProductsWithFinancialsUseCase.execute({
      accountId,
      page,
      limit,
    });

    return {
      statusCode: 200,
      body: result,
    };
  }
}

export namespace ListProductsWithFinancialsController {
  export type QueryParams = {
    page?: number;
    limit?: number;
  }

  export type Request = Controller.Request<
    'private',
    Record<string, unknown>,
    Record<string, string>,
    ListProductsWithFinancialsController.QueryParams
  >

  export type Response = ListProductsWithFinancialsUseCase.Output;
}
