import { Injectable } from '@kernel/decorators/Injactable';
import { and, count, desc, eq } from 'drizzle-orm';

import { AlertType } from '../../enums/AlertType';
import { DrizzleClient } from '../../Client';
import { alerts } from '../../schemas';

@Injectable()
export class AlertRepository {
  constructor(private readonly db: DrizzleClient) { }

  async create(input: AlertRepository.CreateInput, tx?: DrizzleClient.Transaction) {
    const executor = tx ?? this.db.client;

    const [created] = await executor
      .insert(alerts)
      .values({
        accountId: input.accountId,
        type: input.type,
        message: input.message,
        metadata: input.metadata ?? null,
      })
      .returning();

    return created;
  }

  async createMany(inputs: AlertRepository.CreateInput[], tx?: DrizzleClient.Transaction) {
    if (inputs.length === 0) return [];

    const executor = tx ?? this.db.client;

    return executor
      .insert(alerts)
      .values(inputs.map(input => ({
        accountId: input.accountId,
        type: input.type,
        message: input.message,
        metadata: input.metadata ?? null,
      })))
      .returning();
  }

  async findByAccount(input: { accountId: string; limit: number; offset: number }) {
    return this.db.client
      .select()
      .from(alerts)
      .where(eq(alerts.accountId, input.accountId))
      .orderBy(desc(alerts.createdAt))
      .limit(input.limit)
      .offset(input.offset);
  }

  async countByAccount(accountId: string): Promise<number> {
    const [result] = await this.db.client
      .select({ count: count() })
      .from(alerts)
      .where(eq(alerts.accountId, accountId));

    return Number(result.count);
  }

  async countUnreadByAccount(accountId: string): Promise<number> {
    const [result] = await this.db.client
      .select({ count: count() })
      .from(alerts)
      .where(and(
        eq(alerts.accountId, accountId),
        eq(alerts.read, false),
      ));

    return Number(result.count);
  }

  async markAsRead(input: { alertId: string; accountId: string }): Promise<boolean> {
    const updated = await this.db.client
      .update(alerts)
      .set({ read: true })
      .where(and(
        eq(alerts.id, input.alertId),
        eq(alerts.accountId, input.accountId),
      ))
      .returning({ id: alerts.id });

    return updated.length > 0;
  }
}

export namespace AlertRepository {
  export type CreateInput = {
    accountId: string;
    type: AlertType;
    message: string;
    metadata?: string | null;
  };
}
