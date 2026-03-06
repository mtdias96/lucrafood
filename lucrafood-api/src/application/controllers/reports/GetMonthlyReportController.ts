import { Controller } from '@application/contracts/Controller';
import { GetMonthlyReportUseCase } from '@application/usecases/reports/GetMonthlyReportUseCase';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class GetMonthlyReportController extends Controller<'private', GetMonthlyReportController.Response> {

  constructor(
    private readonly getMonthlyReportUseCase: GetMonthlyReportUseCase,
  ) {
    super();
  }

  protected override async handle({ accountId, queryParams }: GetMonthlyReportController.Request): Promise<Controller.Response<GetMonthlyReportController.Response>> {
    const month = queryParams.month as string;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return {
        statusCode: 400,
        body: { error: 'Query param "month" is required in format YYYY-MM' } as any,
      };
    }

    const result = await this.getMonthlyReportUseCase.execute({ accountId, month });

    return {
      statusCode: 200,
      body: result,
    };
  }
}

export namespace GetMonthlyReportController {
  export type Request = Controller.Request<'private'>;
  export type Response = GetMonthlyReportUseCase.Output;
}
