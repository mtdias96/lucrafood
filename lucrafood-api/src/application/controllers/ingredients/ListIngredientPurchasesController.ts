import { Controller } from '@application/contracts/Controller';
import { ListIngredientPurchasesUseCase } from '@application/usecases/ingredients/ListIngredientPurchasesUseCase';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class ListIngredientPurchasesController extends Controller<'private', ListIngredientPurchasesController.Response> {
  constructor(private readonly listIngredientPurchasesUseCase: ListIngredientPurchasesUseCase) {
    super();
  }

  protected override async handle({ accountId, params, queryParams }: ListIngredientPurchasesController.Request): Promise<Controller.Response<ListIngredientPurchasesController.Response>> {
    const page = queryParams.page !== undefined ? Number(queryParams.page) : undefined;
    const limit = queryParams.limit !== undefined ? Number(queryParams.limit) : undefined;

    const result = await this.listIngredientPurchasesUseCase.execute({
      ingredientId: params.ingredientId,
      accountId,
      page,
      limit,
    });

    return { statusCode: 200, body: result };
  }
}

export namespace ListIngredientPurchasesController {
  export type Request = Controller.Request<
    'private',
    Record<string, unknown>,
    { ingredientId: string },
    { page?: number; limit?: number }
  >;

  export type Response = ListIngredientPurchasesUseCase.Output;
}
