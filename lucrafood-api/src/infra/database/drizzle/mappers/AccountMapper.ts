import { Account } from '@application/entities/Account';
import { accountsTable } from '../schemas';

export class AccountMapper {
  static toRow(entity: Account): typeof accountsTable.$inferInsert {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      passowrd_hashed: entity.passwordHash,
      createdAt: entity.createdAt,
    };
  }

  static toEntity(row: typeof accountsTable.$inferSelect): Account {
    return new Account({
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.passowrd_hashed,
      createdAt: row.createdAt,
    });
  }
}
