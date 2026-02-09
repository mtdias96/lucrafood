
import { IngredientStore } from '@application/entities/IngredientStore';
import { DbError } from '@application/errors/db/DbError';
import { Injectable } from '@kernel/decorators/Injactable';
import { and, eq } from 'drizzle-orm';
import { DrizzleClient } from '../../Client';
import { stores } from '../../schemas';
;

@Injectable()
export class IngredientStoreRepository {
  constructor(private readonly db: DrizzleClient) { }

  async findById(input: { storeId: string, accountId: string }): Promise<IngredientStore | null> {
    const [row] = await this.db.client
      .select()
      .from(stores)
      .where(and(
        eq(stores.id, input.storeId),
        eq(stores.accountId, input.accountId),
      ))
      .limit(1);

    return row ?? null;
  }
  async findByName(input: { name: string, accountId: string }): Promise<IngredientStore | null> {
    const [row] = await this.db.client
      .select()
      .from(stores)
      .where(and(
        eq(stores.name, input.name),
        eq(stores.accountId, input.accountId),
      ))
      .limit(1);

    return row ?? null;
  }

  async create(input: IngredientStore): Promise<IngredientStore> {
    const [row] = await this.db.client
      .insert(stores)
      .values(input)
      .returning();

    if (!row) {
      throw new DbError('DB_INSERT_FAILED: stores returned no row');
    }

    return row;
  }
}
