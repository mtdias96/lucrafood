import { Controller } from '@application/contracts/Controller';
import { GetProductsRankingUseCase } from '@application/usecases/analytics/GetProductsRankingUseCase';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class GetProductsRankingController extends Controller<'private', GetProductsRankingController.Response> {

  constructor(
    private readonly getProductsRankingUseCase: GetProductsRankingUseCase,
  ) {
    super();
  }

  protected override async handle({ accountId }: GetProductsRankingController.Request): Promise<Controller.Response<GetProductsRankingController.Response>> {
    const result = await this.getProductsRankingUseCase.execute({ accountId });

    return {
      statusCode: 200,
      body: result,
    };
  }
}

export namespace GetProductsRankingController {
  export type Request = Controller.Request<'private'>;

  export type Response = GetProductsRankingUseCase.Output;
}
