
import { Injectable } from '@kernel/decorators/Injactable';
import { and, eq } from 'drizzle-orm';

import { Ingredient } from '@application/entities/Ingredient';
import { DrizzleClient } from '../Client';
import { ingredientsTable } from '../schemas';

@Injectable()
export class IngredientRepository {
  constructor(private readonly db: DrizzleClient) { }

  async findByName(name: string, accountId: string): Promise<Ingredient | null> {
    const [row] = await this.db.client
      .select()
      .from(ingredientsTable)
      .where(and(
        eq(ingredientsTable.name, name),
        eq(ingredientsTable.accountId, accountId),
      ))
      .limit(1);

    return row ?? null;
  }

  async create(ingredient: Ingredient): Promise<Ingredient> {
    const [created] = await this.db.client
      .insert(ingredientsTable)
      .values(ingredient)
      .returning();

    return created ?? null;
  }
}
