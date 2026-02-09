
import { Account } from '@application/entities/Account';
import { Injectable } from '@kernel/decorators/Injactable';
import { eq } from 'drizzle-orm';

import { DrizzleClient } from '../Client';
import { AccountMapper } from '../mappers/AccountMapper';
import { accounts } from '../schemas';

@Injectable()
export class AccountRepository {
  constructor(private readonly db: DrizzleClient) { }

  async findByEmail(email: string): Promise<Account | null> {
    const [row] = await this.db.client
      .select()
      .from(accounts)
      .where(eq(accounts.email, email))
      .limit(1);

    return row ? AccountMapper.toEntity(row) : null;
  }

  async create(account: Account): Promise<void> {
    await this.db.client.insert(accounts).values(AccountMapper.toRow(account));
  }
}
