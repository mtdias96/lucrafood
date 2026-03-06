import { Controller } from '@application/contracts/Controller';
import { CheckAlertsUseCase } from '@application/usecases/alerts/CheckAlertsUseCase';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class CheckAlertsController extends Controller<'private', CheckAlertsController.Response> {

  constructor(
    private readonly checkAlertsUseCase: CheckAlertsUseCase,
  ) {
    super();
  }

  protected override async handle({ accountId }: CheckAlertsController.Request): Promise<Controller.Response<CheckAlertsController.Response>> {
    const result = await this.checkAlertsUseCase.execute({ accountId });

    return {
      statusCode: 200,
      body: result,
    };
  }
}

export namespace CheckAlertsController {
  export type Request = Controller.Request<'private'>;
  export type Response = CheckAlertsUseCase.Output;
}
