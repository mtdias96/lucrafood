
import { Injectable } from '@kernel/decorators/Injactable';
import { and, eq, sql } from 'drizzle-orm';

import { DbError } from '@application/errors/db/DbError';
import { PackageUnit } from '@shared/types/PackageUnit';
import { DrizzleClient } from '../../Client';
import { ingredientStock } from '../../schemas/ingredientStock';
import { ingredients } from '../../schemas/ingredients';
import { productStock } from '../../schemas/productStock';
import { products } from '../../schemas/products';

type Executor = DrizzleClient['client'] | DrizzleClient.Transaction;

@Injectable()
export class StockRepository {
  constructor(private readonly db: DrizzleClient) { }

  private executor(tx?: DrizzleClient.Transaction): Executor {
    return tx ?? this.db.client;
  }

  // ========================
  // Ingredient Stock
  // ========================

  async findAllIngredientStock(accountId: string): Promise<StockRepository.IngredientStockRow[]> {
    return this.db.client
      .select({
        id: ingredientStock.id,
        ingredientId: ingredientStock.ingredientId,
        ingredientName: ingredients.name,
        currentQty: ingredientStock.currentQty,
        minQty: ingredientStock.minQty,
        unit: ingredientStock.unit,
        updatedAt: ingredientStock.updatedAt,
      })
      .from(ingredientStock)
      .innerJoin(ingredients, eq(ingredients.id, ingredientStock.ingredientId))
      .where(eq(ingredientStock.accountId, accountId));
  }

  async findIngredientStock(input: { ingredientId: string, accountId: string }, tx?: DrizzleClient.Transaction): Promise<StockRepository.IngredientStockRow | null> {
    const [row] = await this.executor(tx)
      .select({
        id: ingredientStock.id,
        ingredientId: ingredientStock.ingredientId,
        ingredientName: ingredients.name,
        currentQty: ingredientStock.currentQty,
        minQty: ingredientStock.minQty,
        unit: ingredientStock.unit,
        updatedAt: ingredientStock.updatedAt,
      })
      .from(ingredientStock)
      .innerJoin(ingredients, eq(ingredients.id, ingredientStock.ingredientId))
      .where(and(
        eq(ingredientStock.ingredientId, input.ingredientId),
        eq(ingredientStock.accountId, input.accountId),
      ))
      .limit(1);

    return row ?? null;
  }

  async upsertIngredientStock(input: {
    ingredientId: string;
    accountId: string;
    currentQty: number;
    minQty: number;
    unit: PackageUnit;
  }, tx?: DrizzleClient.Transaction) {
    const [row] = await this.executor(tx)
      .insert(ingredientStock)
      .values({
        ingredientId: input.ingredientId,
        accountId: input.accountId,
        currentQty: input.currentQty.toFixed(3),
        minQty: input.minQty.toFixed(3),
        unit: input.unit,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [ingredientStock.ingredientId, ingredientStock.accountId],
        set: {
          currentQty: input.currentQty.toFixed(3),
          minQty: input.minQty.toFixed(3),
          unit: input.unit,
          updatedAt: new Date(),
        },
      })
      .returning();

    if (!row) {
      throw new DbError('DB_UPSERT_FAILED: ingredientStock returned no row');
    }

    return row;
  }

  async incrementIngredientStock(input: {
    ingredientId: string;
    accountId: string;
    qtyToAdd: number;
    unit: PackageUnit;
  }, tx?: DrizzleClient.Transaction) {
    const [row] = await this.executor(tx)
      .insert(ingredientStock)
      .values({
        ingredientId: input.ingredientId,
        accountId: input.accountId,
        currentQty: input.qtyToAdd.toFixed(3),
        minQty: '0',
        unit: input.unit,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [ingredientStock.ingredientId, ingredientStock.accountId],
        set: {
          currentQty: sql`${ingredientStock.currentQty}::numeric + ${input.qtyToAdd.toFixed(3)}::numeric`,
          updatedAt: new Date(),
        },
      })
      .returning();

    if (!row) {
      throw new DbError('DB_UPSERT_FAILED: ingredientStock increment returned no row');
    }

    return row;
  }

  async decrementIngredientStock(input: {
    ingredientId: string;
    accountId: string;
    qtyToSubtract: number;
  }, tx?: DrizzleClient.Transaction) {
    const [row] = await this.executor(tx)
      .update(ingredientStock)
      .set({
        currentQty: sql`${ingredientStock.currentQty}::numeric - ${input.qtyToSubtract.toFixed(3)}::numeric`,
        updatedAt: new Date(),
      })
      .where(and(
        eq(ingredientStock.ingredientId, input.ingredientId),
        eq(ingredientStock.accountId, input.accountId),
      ))
      .returning();

    return row ?? null;
  }

  // ========================
  // Product Stock
  // ========================

  async findAllProductStock(accountId: string): Promise<StockRepository.ProductStockRow[]> {
    return this.db.client
      .select({
        id: productStock.id,
        productId: productStock.productId,
        productName: products.name,
        currentQty: productStock.currentQty,
        minQty: productStock.minQty,
        unit: productStock.unit,
        updatedAt: productStock.updatedAt,
      })
      .from(productStock)
      .innerJoin(products, eq(products.id, productStock.productId))
      .where(eq(productStock.accountId, accountId));
  }

  async upsertProductStock(input: {
    productId: string;
    accountId: string;
    currentQty: number;
    minQty: number;
    unit: PackageUnit;
  }, tx?: DrizzleClient.Transaction) {
    const [row] = await this.executor(tx)
      .insert(productStock)
      .values({
        productId: input.productId,
        accountId: input.accountId,
        currentQty: input.currentQty.toFixed(3),
        minQty: input.minQty.toFixed(3),
        unit: input.unit,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [productStock.productId, productStock.accountId],
        set: {
          currentQty: input.currentQty.toFixed(3),
          minQty: input.minQty.toFixed(3),
          unit: input.unit,
          updatedAt: new Date(),
        },
      })
      .returning();

    if (!row) {
      throw new DbError('DB_UPSERT_FAILED: productStock returned no row');
    }

    return row;
  }

  async incrementProductStock(input: {
    productId: string;
    accountId: string;
    qtyToAdd: number;
    unit: PackageUnit;
  }, tx?: DrizzleClient.Transaction) {
    const [row] = await this.executor(tx)
      .insert(productStock)
      .values({
        productId: input.productId,
        accountId: input.accountId,
        currentQty: input.qtyToAdd.toFixed(3),
        minQty: '0',
        unit: input.unit,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [productStock.productId, productStock.accountId],
        set: {
          currentQty: sql`${productStock.currentQty}::numeric + ${input.qtyToAdd.toFixed(3)}::numeric`,
          updatedAt: new Date(),
        },
      })
      .returning();

    if (!row) {
      throw new DbError('DB_UPSERT_FAILED: productStock increment returned no row');
    }

    return row;
  }
}

export namespace StockRepository {
  export type IngredientStockRow = {
    id: string;
    ingredientId: string;
    ingredientName: string;
    currentQty: string;
    minQty: string;
    unit: PackageUnit;
    updatedAt: Date;
  };

  export type ProductStockRow = {
    id: string;
    productId: string;
    productName: string;
    currentQty: string;
    minQty: string;
    unit: PackageUnit;
    updatedAt: Date;
  };
}
