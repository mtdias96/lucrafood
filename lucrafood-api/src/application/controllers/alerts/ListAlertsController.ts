import { Controller } from '@application/contracts/Controller';
import { ListAlertsUseCase } from '@application/usecases/alerts/ListAlertsUseCase';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class ListAlertsController extends Controller<'private', ListAlertsController.Response> {

  constructor(
    private readonly listAlertsUseCase: ListAlertsUseCase,
  ) {
    super();
  }

  protected override async handle({ accountId, queryParams }: ListAlertsController.Request): Promise<Controller.Response<ListAlertsController.Response>> {
    const page = queryParams.page ? Number(queryParams.page) : 1;
    const limit = queryParams.limit ? Number(queryParams.limit) : 20;

    const result = await this.listAlertsUseCase.execute({ accountId, page, limit });

    return {
      statusCode: 200,
      body: result,
    };
  }
}

export namespace ListAlertsController {
  export type Request = Controller.Request<'private'>;
  export type Response = ListAlertsUseCase.Output;
}
