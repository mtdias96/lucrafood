
import { ProductFinancialService } from '@application/service/ProductFinancialService';
import { NotFound } from '@application/errors/http/NotFound';
import { ingredientPurchaseRepository } from '@infra/database/drizzle/repository/ingredients/ingredientPurchaseRepository';
import { ProductRepository } from '@infra/database/drizzle/repository/products/productRepository';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class GetProductProfitHistoryUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly ingredientPurchaseRepo: ingredientPurchaseRepository,
  ) { }

  async execute(input: GetProductProfitHistoryUseCase.Input): Promise<GetProductProfitHistoryUseCase.Output> {
    const { accountId, productId } = input;

    const product = await this.productRepository.findOneWithRecipeByAccount({ productId, accountId });

    if (!product) {
      throw new NotFound('Product not found');
    }

    const ingredientIds = product.items.map(i => i.ingredientId);

    if (ingredientIds.length === 0) {
      return { productId: product.id, productName: product.name, history: [] };
    }

    const allPurchases = await this.ingredientPurchaseRepo.findAllByIngredientIds({ ingredientIds, accountId });

    if (allPurchases.length === 0) {
      return { productId: product.id, productName: product.name, history: [] };
    }

    // Build snapshots: for each purchase date, compute financials
    // using the latest unit price per ingredient known at that point
    const priceState = new Map<string, number>();
    const history: GetProductProfitHistoryUseCase.HistoryEntry[] = [];

    for (const purchase of allPurchases) {
      priceState.set(purchase.ingredientId, Number(purchase.unitPrice));

      const { financials } = ProductFinancialService.calculate(product, priceState);

      history.push({
        date: purchase.purchasedAt,
        ingredientId: purchase.ingredientId,
        totalCost: financials.totalCost,
        unitCost: financials.unitCost,
        grossProfit: financials.grossProfit,
        profitMargin: financials.profitMargin,
      });
    }

    return {
      productId: product.id,
      productName: product.name,
      history,
    };
  }
}

export namespace GetProductProfitHistoryUseCase {
  export type Input = {
    accountId: string;
    productId: string;
  };

  export type HistoryEntry = {
    date: Date;
    ingredientId: string;
    totalCost: number;
    unitCost: number;
    grossProfit: number;
    profitMargin: number;
  };

  export type Output = {
    productId: string;
    productName: string;
    history: HistoryEntry[];
  };
}
