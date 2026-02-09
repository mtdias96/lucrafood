
import { Injectable } from '@kernel/decorators/Injactable';

import { IngredientPurchase } from '@application/entities/IngredientsPurchase';
import { DbError } from '@application/errors/db/DbError';
import { DrizzleClient } from '../../Client';
import { IngredientPriceMapper } from '../../mappers/IngredientPriceMapper';
import { ingredientPurchases } from '../../schemas';

@Injectable()
export class ingredientPurchaseRepository {
  constructor(private readonly db: DrizzleClient) { }

  async create(entity: IngredientPurchase): Promise<IngredientPurchase> {
    const IngredientPurchaseMapper = IngredientPriceMapper.toRow(entity);

    const [created] = await this.db.client
      .insert(ingredientPurchases)
      .values(IngredientPurchaseMapper)
      .returning();

    if (!created) {
      throw new DbError('DB_INSERT_FAILED: ingredientPurchase returned no row');
    }

    return IngredientPriceMapper.toEntity(created);
  }
}
