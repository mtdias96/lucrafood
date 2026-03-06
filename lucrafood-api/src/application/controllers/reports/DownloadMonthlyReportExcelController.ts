import { Controller } from '@application/contracts/Controller';
import { ExcelReportGenerator } from '@infra/reports/ExcelReportGenerator';
import { GetMonthlyReportUseCase } from '@application/usecases/reports/GetMonthlyReportUseCase';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class DownloadMonthlyReportExcelController extends Controller<'private', Buffer> {

  constructor(
    private readonly getMonthlyReportUseCase: GetMonthlyReportUseCase,
  ) {
    super();
  }

  protected override async handle({ accountId, queryParams }: Controller.Request<'private'>): Promise<Controller.Response<Buffer>> {
    const month = queryParams.month as string;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return {
        statusCode: 400,
        body: Buffer.from(JSON.stringify({ error: 'Query param "month" is required in format YYYY-MM' })),
      };
    }

    const report = await this.getMonthlyReportUseCase.execute({ accountId, month });
    const excel = await ExcelReportGenerator.generate(report);

    return {
      statusCode: 200,
      body: excel,
    };
  }
}
