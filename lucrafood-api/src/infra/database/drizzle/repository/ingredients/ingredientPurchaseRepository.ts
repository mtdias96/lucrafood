
import { Injectable } from '@kernel/decorators/Injactable';

import { IngredientPurchase } from '@application/entities/IngredientsPurchase';
import { DbError } from '@application/errors/db/DbError';
import { DrizzleClient } from '../../Client';

import { IngredietPurchaseMapper } from '../../mappers/IngredietPurchaseMapper';
import { ingredientPurchases } from '../../schemas';

@Injectable()
export class ingredientPurchaseRepository {
  constructor(private readonly db: DrizzleClient) { }

  async create(entity: IngredientPurchase): Promise<IngredientPurchase> {
    const values = IngredietPurchaseMapper.toRow(entity);

    const [created] = await this.db.client
      .insert(ingredientPurchases)
      .values(values)
      .returning();

    if (!created) {
      throw new DbError('DB_INSERT_FAILED: ingredientPurchase returned no row');
    }

    return IngredietPurchaseMapper.toEntity(created);
  }
}
