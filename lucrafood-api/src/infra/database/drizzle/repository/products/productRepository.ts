
import { Injectable } from '@kernel/decorators/Injactable';
import { and, eq } from 'drizzle-orm';

import { Product } from '@application/entities/Product';
import { DbError } from '@application/errors/db/DbError';
import { DrizzleClient } from '../../Client';
import { ingredients, products } from '../../schemas';

@Injectable()
export class ProductRepository {
  constructor(private readonly db: DrizzleClient) { }

  async findByName(input: { name: string, accountId: string }): Promise<Product | null> {
    const [row] = await this.db.client
      .select()
      .from(products)
      .where(and(
        eq(products.name, input.name),
        eq(products.accountId, input.accountId),
      ))
      .limit(1);

    return row ?? null;
  }

  async findById(input: { ingredientId: string, accountId: string }): Promise<Product | null> {
    const [row] = await this.db.client
      .select()
      .from(products)
      .where(and(
        eq(ingredients.id, input.ingredientId),
        eq(ingredients.accountId, input.accountId),
      ))
      .limit(1);

    return row ?? null;
  }

  async create(input: Product): Promise<Product> {
    const [created] = await this.db.client
      .insert(products)
      .values(input)
      .returning();

    if (!created) {
      throw new DbError('DB_INSERT_FAILED: Product returned no row');
    }

    return created;
  }
}
