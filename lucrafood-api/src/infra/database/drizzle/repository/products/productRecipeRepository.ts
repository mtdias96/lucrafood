
import { Injectable } from '@kernel/decorators/Injactable';
import { and, eq } from 'drizzle-orm';

import { ProductRecipe } from '@application/entities/ProductRecipe';
import { DbError } from '@application/errors/db/DbError';
import { DrizzleClient } from '../../Client';
import { ProductRecipeMapper } from '../../mappers/ProductRecipeMapper';
import { productRecipeItems } from '../../schemas/productRecipeItems';

@Injectable()
export class ProductRecipeRepository {
  constructor(private readonly db: DrizzleClient) { }

  async findById(entity: { productId: string, accountId: string }): Promise<ProductRecipe | null> {

    const [row] = await this.db.client
      .select()
      .from(productRecipeItems)
      .where(and(
        eq(productRecipeItems.productId, entity.productId),
        eq(productRecipeItems.accountId, entity.accountId),
      ))
      .limit(1);

    return row ? ProductRecipeMapper.toEntity(row) : null;
  }

  async create(entity: ProductRecipe): Promise<ProductRecipe> {
    const value = ProductRecipeMapper.toRow(entity);

    const [created] = await this.db.client
      .insert(productRecipeItems)
      .values(value)
      .returning();

    if (!created) {
      throw new DbError('DB_INSERT_FAILED: Product returned no row');
    }

    return ProductRecipeMapper.toEntity(created);
  }
}
