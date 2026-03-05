import { Controller } from '@application/contracts/Controller';
import { ListStockUseCase } from '@application/usecases/stock/ListStockUseCase';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class ListStockController extends Controller<'private', ListStockController.Response> {

  constructor(
    private readonly listStockUseCase: ListStockUseCase,
  ) {
    super();
  }

  protected override async handle({ accountId }: ListStockController.Request): Promise<Controller.Response<ListStockController.Response>> {
    const result = await this.listStockUseCase.execute({ accountId });

    return {
      statusCode: 200,
      body: result,
    };
  }
}

export namespace ListStockController {
  export type Request = Controller.Request<'private'>;

  export type Response = ListStockUseCase.Output;
}
