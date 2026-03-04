import { Controller } from '@application/contracts/Controller';
import { ListIngredientsUseCase } from '@application/usecases/ingredients/ListIngredientsUseCase';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class ListIngredientsController extends Controller<'private', ListIngredientsController.Response> {
  constructor(private readonly listIngredientsUseCase: ListIngredientsUseCase) {
    super();
  }

  protected override async handle({ accountId, queryParams }: ListIngredientsController.Request): Promise<Controller.Response<ListIngredientsController.Response>> {
    const page = queryParams.page !== undefined ? Number(queryParams.page) : undefined;
    const limit = queryParams.limit !== undefined ? Number(queryParams.limit) : undefined;

    const result = await this.listIngredientsUseCase.execute({ accountId, page, limit });

    return { statusCode: 200, body: result };
  }
}

export namespace ListIngredientsController {
  export type Request = Controller.Request<
    'private',
    Record<string, unknown>,
    Record<string, string>,
    { page?: number; limit?: number }
  >;

  export type Response = ListIngredientsUseCase.Output;
}
