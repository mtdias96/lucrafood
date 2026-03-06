import { NotFound } from '@application/errors/http/NotFound';
import { AlertRepository } from '@infra/database/drizzle/repository/alerts/AlertRepository';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class MarkAlertAsReadUseCase {
  constructor(
    private readonly alertRepository: AlertRepository,
  ) { }

  async execute(input: MarkAlertAsReadUseCase.Input): Promise<void> {
    const { alertId, accountId } = input;

    const updated = await this.alertRepository.markAsRead({ alertId, accountId });

    if (!updated) {
      throw new NotFound('Alert not found');
    }
  }
}

export namespace MarkAlertAsReadUseCase {
  export type Input = {
    alertId: string;
    accountId: string;
  };
}
