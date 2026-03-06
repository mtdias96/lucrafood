import { Controller } from '@application/contracts/Controller';
import { MarkAlertAsReadUseCase } from '@application/usecases/alerts/MarkAlertAsReadUseCase';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class MarkAlertAsReadController extends Controller<'private', void> {

  constructor(
    private readonly markAlertAsReadUseCase: MarkAlertAsReadUseCase,
  ) {
    super();
  }

  protected override async handle({ accountId, params }: MarkAlertAsReadController.Request): Promise<Controller.Response<void>> {
    const alertId = params.id as string;

    await this.markAlertAsReadUseCase.execute({ alertId, accountId });

    return {
      statusCode: 204,
    };
  }
}

export namespace MarkAlertAsReadController {
  export type Request = Controller.Request<'private'>;
}
