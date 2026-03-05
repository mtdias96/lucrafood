import { Controller } from '@application/contracts/Controller';
import { GetIngredientPriceHistoryUseCase } from '@application/usecases/analytics/GetIngredientPriceHistoryUseCase';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class GetIngredientPriceHistoryController extends Controller<'private', GetIngredientPriceHistoryController.Response> {

  constructor(
    private readonly getIngredientPriceHistoryUseCase: GetIngredientPriceHistoryUseCase,
  ) {
    super();
  }

  protected override async handle({ accountId, params }: GetIngredientPriceHistoryController.Request): Promise<Controller.Response<GetIngredientPriceHistoryController.Response>> {
    const { ingredientId } = params;

    const result = await this.getIngredientPriceHistoryUseCase.execute({
      accountId,
      ingredientId,
    });

    return {
      statusCode: 200,
      body: result,
    };
  }
}

export namespace GetIngredientPriceHistoryController {
  export type Request = Controller.Request<
    'private',
    Record<string, unknown>,
    { ingredientId: string }
  >;

  export type Response = GetIngredientPriceHistoryUseCase.Output;
}
