
import { Injectable } from '@kernel/decorators/Injactable';
import { and, eq } from 'drizzle-orm';

import { IngredientStore } from '@application/entities/IngredientStore';
import { DrizzleClient } from '../../Client';
import { ingredientStoresTable } from '../../schemas';

@Injectable()
export class IngredientStoreRepository {
  constructor(private readonly db: DrizzleClient) { }

  async findByName(name: string, ingredientId: string): Promise<IngredientStore | null> {
    const [row] = await this.db.client
      .select()
      .from(ingredientStoresTable)
      .where(and(
        eq(ingredientStoresTable.name, name),
        eq(ingredientStoresTable.ingredientId, ingredientId),
      ))
      .limit(1);

    return row ?? null;
  }

  async create(ingredientStore: IngredientStore): Promise<IngredientStore> {
    const [created] = await this.db.client
      .insert(ingredientStoresTable)
      .values(ingredientStore)
      .returning();

    return created ?? null;
  }
}
