
import { ProductFinancialService } from '@application/service/ProductFinancialService';
import { ingredientPurchaseRepository } from '@infra/database/drizzle/repository/ingredients/ingredientPurchaseRepository';
import { ProductRepository } from '@infra/database/drizzle/repository/products/productRepository';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class GetGlobalProfitHistoryUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly ingredientPurchaseRepo: ingredientPurchaseRepository,
  ) { }

  async execute(input: GetGlobalProfitHistoryUseCase.Input): Promise<GetGlobalProfitHistoryUseCase.Output> {
    const { accountId } = input;

    const products = await this.productRepository.findAllWithRecipeByAccount({ accountId });

    if (products.length === 0) {
      return { history: [] };
    }

    const allIngredientIds = [...new Set(
      products.flatMap(p => p.items.map(i => i.ingredientId)),
    )];

    if (allIngredientIds.length === 0) {
      return { history: [] };
    }

    const allPurchases = await this.ingredientPurchaseRepo.findAllByIngredientIds({
      ingredientIds: allIngredientIds,
      accountId,
    });

    if (allPurchases.length === 0) {
      return { history: [] };
    }

    const priceState = new Map<string, number>();
    const history: GetGlobalProfitHistoryUseCase.HistoryEntry[] = [];

    for (const purchase of allPurchases) {
      priceState.set(purchase.ingredientId, Number(purchase.unitPrice));

      let totalCost = 0;
      let totalRevenue = 0;
      let totalProfit = 0;

      const productSnapshots: GetGlobalProfitHistoryUseCase.ProductSnapshot[] = [];

      for (const product of products) {
        const { financials } = ProductFinancialService.calculate(product, priceState);
        const salePrice = Number(product.salePrice);

        productSnapshots.push({
          productId: product.id,
          productName: product.name,
          unitCost: financials.unitCost,
          grossProfit: financials.grossProfit,
          profitMargin: financials.profitMargin,
        });

        totalCost += financials.unitCost;
        totalRevenue += salePrice;
        totalProfit += financials.grossProfit;
      }

      history.push({
        date: purchase.purchasedAt,
        totalCost: Number(totalCost.toFixed(2)),
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalProfit: Number(totalProfit.toFixed(2)),
        products: productSnapshots,
      });
    }

    return { history };
  }
}

export namespace GetGlobalProfitHistoryUseCase {
  export type Input = {
    accountId: string;
  };

  export type ProductSnapshot = {
    productId: string;
    productName: string;
    unitCost: number;
    grossProfit: number;
    profitMargin: number;
  };

  export type HistoryEntry = {
    date: Date;
    totalCost: number;
    totalRevenue: number;
    totalProfit: number;
    products: ProductSnapshot[];
  };

  export type Output = {
    history: HistoryEntry[];
  };
}
