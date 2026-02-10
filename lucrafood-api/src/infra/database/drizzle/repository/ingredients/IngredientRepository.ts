
import { Injectable } from '@kernel/decorators/Injactable';
import { and, eq } from 'drizzle-orm';

import { Ingredient } from '@application/entities/Ingredient';
import { DbError } from '@application/errors/db/DbError';
import { DrizzleClient } from '../../Client';
import { ingredients } from '../../schemas';

@Injectable()
export class IngredientRepository {
  constructor(private readonly db: DrizzleClient) { }

  async findByName(input: { name: string, accountId: string }): Promise<Ingredient | null> {
    const [row] = await this.db.client
      .select()
      .from(ingredients)
      .where(and(
        eq(ingredients.name, input.name),
        eq(ingredients.accountId, input.accountId),
      ))
      .limit(1);

    return row ?? null;
  }

  async findById(input: { ingredientId: string, accountId: string }): Promise<Ingredient | null> {
    const [row] = await this.db.client
      .select()
      .from(ingredients)
      .where(and(
        eq(ingredients.id, input.ingredientId),
        eq(ingredients.accountId, input.accountId),
      ))
      .limit(1);

    return row ?? null;
  }

  async create(input: Ingredient): Promise<Ingredient> {
    const [created] = await this.db.client
      .insert(ingredients)
      .values(input)
      .returning();

    if (!created) {
      throw new DbError('DB_INSERT_FAILED: ingredient returned no row');
    }

    return created;
  }
}
