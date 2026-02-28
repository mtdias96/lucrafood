
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

  async create(entity: ProductRecipe[]): Promise<ProductRecipe[]> {
    const value = ProductRecipeMapper.toRows(entity);

    const result = await this.db.client
      .insert(productRecipeItems)
      .values(value)
      .returning();

    if (result.length === 0) {
      throw new DbError('DB_INSERT_FAILED: no rows returned');
    }

    const resultMapper = result.map((r => ProductRecipeMapper.toEntity(r)));

    return resultMapper;
  }

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

  async addRecipeItem(entity: ProductRecipe[]) {
    const values = ProductRecipeMapper.toRows(entity);

    return this.db.client
      .insert(productRecipeItems)
      .values(values)
      .returning({
        id: productRecipeItems.id,
        ingredientId: productRecipeItems.ingredientId,
        productId: productRecipeItems.productId,
        quantityUsed: productRecipeItems.quantityUsed,
        accountId: productRecipeItems.accountId,
        unitUsed: productRecipeItems.unitUsed,
      });
  }

}
