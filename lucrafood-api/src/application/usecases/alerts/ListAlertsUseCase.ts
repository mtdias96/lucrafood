import { AlertRepository } from '@infra/database/drizzle/repository/alerts/AlertRepository';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class ListAlertsUseCase {
  constructor(
    private readonly alertRepository: AlertRepository,
  ) { }

  async execute(input: ListAlertsUseCase.Input): Promise<ListAlertsUseCase.Output> {
    const { accountId, page = 1, limit = 20 } = input;
    const offset = (page - 1) * limit;

    const [alerts, total, unread] = await Promise.all([
      this.alertRepository.findByAccount({ accountId, limit, offset }),
      this.alertRepository.countByAccount(accountId),
      this.alertRepository.countUnreadByAccount(accountId),
    ]);

    return {
      alerts: alerts.map(a => ({
        id: a.id,
        type: a.type,
        message: a.message,
        metadata: a.metadata ? JSON.parse(a.metadata) : null,
        read: a.read,
        createdAt: a.createdAt,
      })),
      unread,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export namespace ListAlertsUseCase {
  export type Input = {
    accountId: string;
    page?: number;
    limit?: number;
  };

  export type Alert = {
    id: string;
    type: string;
    message: string;
    metadata: Record<string, unknown> | null;
    read: boolean;
    createdAt: Date;
  };

  export type Output = {
    alerts: Alert[];
    unread: number;
    total: number;
    page: number;
    totalPages: number;
  };
}
