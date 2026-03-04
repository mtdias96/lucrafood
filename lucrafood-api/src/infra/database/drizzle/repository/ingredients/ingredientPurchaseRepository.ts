
import { Injectable } from '@kernel/decorators/Injactable';
import { and, avg, count, desc, eq, inArray, max, min } from 'drizzle-orm';

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

  async findLastByIngredientIds({ ingredientIds, accountId }: { ingredientIds: string[], accountId: string }) {
    const rows = await this.db.client
      .select()
      .from(ingredientPurchases)
      .where(and(
        eq(ingredientPurchases.accountId, accountId),
        inArray(ingredientPurchases.ingredientId, ingredientIds),
      ))
      .orderBy(desc(ingredientPurchases.purchasedAt));

    const seen = new Set<string>();
    const result: (typeof rows[number])[] = [];

    for (const row of rows) {
      if (!seen.has(row.ingredientId)) {
        seen.add(row.ingredientId);
        result.push(row);
      }
    }

    return result;
  }

  async findPageByIngredient(input: { ingredientId: string, accountId: string, offset: number, limit: number }) {
    return this.db.client
      .select()
      .from(ingredientPurchases)
      .where(and(
        eq(ingredientPurchases.ingredientId, input.ingredientId),
        eq(ingredientPurchases.accountId, input.accountId),
      ))
      .orderBy(desc(ingredientPurchases.purchasedAt))
      .offset(input.offset)
      .limit(input.limit);
  }

  async countByIngredient(input: { ingredientId: string, accountId: string }): Promise<number> {
    const [result] = await this.db.client
      .select({ count: count() })
      .from(ingredientPurchases)
      .where(and(
        eq(ingredientPurchases.ingredientId, input.ingredientId),
        eq(ingredientPurchases.accountId, input.accountId),
      ));

    return Number(result.count);
  }

  async findStatsByIngredient(input: { ingredientId: string, accountId: string }): Promise<ingredientPurchaseRepository.PriceStats> {
    const where = and(
      eq(ingredientPurchases.ingredientId, input.ingredientId),
      eq(ingredientPurchases.accountId, input.accountId),
    );

    const [[stats], [latest]] = await Promise.all([
      this.db.client
        .select({
          minPrice: min(ingredientPurchases.unitPrice),
          maxPrice: max(ingredientPurchases.unitPrice),
          avgPrice: avg(ingredientPurchases.unitPrice),
          purchaseCount: count(),
        })
        .from(ingredientPurchases)
        .where(where),
      this.db.client
        .select({ unitPrice: ingredientPurchases.unitPrice })
        .from(ingredientPurchases)
        .where(where)
        .orderBy(desc(ingredientPurchases.purchasedAt))
        .limit(1),
    ]);

    return {
      currentPrice: latest ? Number(latest.unitPrice) : null,
      minPrice: stats.minPrice ? Number(stats.minPrice) : null,
      maxPrice: stats.maxPrice ? Number(stats.maxPrice) : null,
      avgPrice: stats.avgPrice ? Number(Number(stats.avgPrice).toFixed(6)) : null,
      purchaseCount: Number(stats.purchaseCount),
    };
  }
}

export namespace ingredientPurchaseRepository {
  export type PriceStats = {
    currentPrice: number | null;
    minPrice: number | null;
    maxPrice: number | null;
    avgPrice: number | null;
    purchaseCount: number;
  };
}
