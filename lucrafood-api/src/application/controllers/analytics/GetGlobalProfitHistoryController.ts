import { Controller } from '@application/contracts/Controller';
import { GetGlobalProfitHistoryUseCase } from '@application/usecases/analytics/GetGlobalProfitHistoryUseCase';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class GetGlobalProfitHistoryController extends Controller<'private', GetGlobalProfitHistoryController.Response> {

  constructor(
    private readonly getGlobalProfitHistoryUseCase: GetGlobalProfitHistoryUseCase,
  ) {
    super();
  }

  protected override async handle({ accountId }: GetGlobalProfitHistoryController.Request): Promise<Controller.Response<GetGlobalProfitHistoryController.Response>> {
    const result = await this.getGlobalProfitHistoryUseCase.execute({ accountId });

    return {
      statusCode: 200,
      body: result,
    };
  }
}

export namespace GetGlobalProfitHistoryController {
  export type Request = Controller.Request<'private'>;

  export type Response = GetGlobalProfitHistoryUseCase.Output;
}
