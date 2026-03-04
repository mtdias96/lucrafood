import { Controller } from '@application/contracts/Controller';
import { GetIngredientDetailUseCase } from '@application/usecases/ingredients/GetIngredientDetailUseCase';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class GetIngredientDetailController extends Controller<'private', GetIngredientDetailController.Response> {
  constructor(private readonly getIngredientDetailUseCase: GetIngredientDetailUseCase) {
    super();
  }

  protected override async handle({ accountId, params }: GetIngredientDetailController.Request): Promise<Controller.Response<GetIngredientDetailController.Response>> {
    const result = await this.getIngredientDetailUseCase.execute({
      ingredientId: params.ingredientId,
      accountId,
    });

    return { statusCode: 200, body: result };
  }
}

export namespace GetIngredientDetailController {
  export type Request = Controller.Request<
    'private',
    Record<string, unknown>,
    { ingredientId: string }
  >;

  export type Response = GetIngredientDetailUseCase.Output;
}
