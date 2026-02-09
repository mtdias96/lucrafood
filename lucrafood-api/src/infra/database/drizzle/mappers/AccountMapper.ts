import { Account } from '@application/entities/Account';
import { accounts } from '../schemas';

export class AccountMapper {
  static toRow(entity: Account): typeof accounts.$inferInsert {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      passowrd_hashed: entity.passwordHash,
      createdAt: entity.createdAt,
    };
  }

  static toEntity(row: typeof accounts.$inferSelect): Account {
    return new Account({
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.passowrd_hashed,
      createdAt: row.createdAt,
    });
  }
}
