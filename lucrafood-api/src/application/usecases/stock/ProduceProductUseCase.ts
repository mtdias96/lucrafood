
import { Conflict } from '@application/errors/http/Conflict';
import { NotFound } from '@application/errors/http/NotFound';
import { UnitPriceService } from '@application/service/UnitBaseCalculator';
import { DrizzleClient } from '@infra/database/drizzle/Client';
import { ProductRepository } from '@infra/database/drizzle/repository/products/productRepository';
import { StockRepository } from '@infra/database/drizzle/repository/stock/StockRepository';
import { Injectable } from '@kernel/decorators/Injactable';
import { PackageUnit } from '@shared/types/PackageUnit';

@Injectable()
export class ProduceProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly stockRepository: StockRepository,
    private readonly db: DrizzleClient,
  ) { }

  async execute(input: ProduceProductUseCase.Input): Promise<ProduceProductUseCase.Output> {
    const { accountId, productId, quantity } = input;

    const product = await this.productRepository.findOneWithRecipeByAccount({ productId, accountId });

    if (!product) {
      throw new NotFound('Product not found');
    }

    if (product.items.length === 0) {
      throw new Conflict('Product has no recipe items');
    }

    const deductions: Array<{ ingredientId: string; ingredientName: string | null; qtyDeducted: number }> = [];

    for (const item of product.items) {
      const baseQtyPerUnit = UnitPriceService.toBaseQty(Number(item.quantity), item.unit as PackageUnit);
      const totalQtyNeeded = baseQtyPerUnit * quantity;

      const stock = await this.stockRepository.findIngredientStock({
        ingredientId: item.ingredientId,
        accountId,
      });

      if (!stock) {
        throw new Conflict(`Ingredient "${item.ingredientName ?? item.ingredientId}" has no stock registered`);
      }

      const currentQtyBase = UnitPriceService.toBaseQty(Number(stock.currentQty), stock.unit as PackageUnit);

      if (currentQtyBase < totalQtyNeeded) {
        throw new Conflict(
          `Insufficient stock for ingredient "${item.ingredientName ?? item.ingredientId}". ` +
          `Needs ${totalQtyNeeded}, available ${currentQtyBase}`,
        );
      }

      deductions.push({
        ingredientId: item.ingredientId,
        ingredientName: item.ingredientName,
        qtyDeducted: totalQtyNeeded,
      });
    }

    await this.db.transaction(async (tx) => {
      for (const deduction of deductions) {
        await this.stockRepository.decrementIngredientStock({
          ingredientId: deduction.ingredientId,
          accountId,
          qtyToSubtract: deduction.qtyDeducted,
        }, tx);
      }

      await this.stockRepository.incrementProductStock({
        productId,
        accountId,
        qtyToAdd: quantity,
        unit: product.yieldUnit,
      }, tx);
    });

    return {
      productId: product.id,
      productName: product.name,
      quantityProduced: quantity,
      ingredientsDeducted: deductions.map(d => ({
        ingredientId: d.ingredientId,
        ingredientName: d.ingredientName,
        qtyDeducted: Number(d.qtyDeducted.toFixed(3)),
      })),
    };
  }
}

export namespace ProduceProductUseCase {
  export type Input = {
    accountId: string;
    productId: string;
    quantity: number;
  };

  export type Output = {
    productId: string;
    productName: string;
    quantityProduced: number;
    ingredientsDeducted: Array<{
      ingredientId: string;
      ingredientName: string | null;
      qtyDeducted: number;
    }>;
  };
}
