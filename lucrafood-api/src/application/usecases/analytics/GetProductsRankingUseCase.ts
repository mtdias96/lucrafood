
import { ProductFinancialService } from '@application/service/ProductFinancialService';
import { ingredientPurchaseRepository } from '@infra/database/drizzle/repository/ingredients/ingredientPurchaseRepository';
import { ProductRepository } from '@infra/database/drizzle/repository/products/productRepository';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class GetProductsRankingUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly ingredientPurchaseRepo: ingredientPurchaseRepository,
  ) { }

  async execute(input: GetProductsRankingUseCase.Input): Promise<GetProductsRankingUseCase.Output> {
    const { accountId } = input;

    const products = await this.productRepository.findAllWithRecipeByAccount({ accountId });

    if (products.length === 0) {
      return { ranking: [] };
    }

    const allIngredientIds = [...new Set(
      products.flatMap(p => p.items.map(i => i.ingredientId)),
    )];

    const latestPurchases = allIngredientIds.length > 0
      ? await this.ingredientPurchaseRepo.findLastByIngredientIds({ ingredientIds: allIngredientIds, accountId })
      : [];

    const unitPriceByIngredient = new Map<string, number>();
    for (const purchase of latestPurchases) {
      unitPriceByIngredient.set(purchase.ingredientId, Number(purchase.unitPrice));
    }

    const ranking: GetProductsRankingUseCase.RankedProduct[] = products.map(product => {
      const { financials } = ProductFinancialService.calculate(product, unitPriceByIngredient);

      return {
        productId: product.id,
        productName: product.name,
        salePrice: Number(product.salePrice),
        totalCost: financials.totalCost,
        unitCost: financials.unitCost,
        grossProfit: financials.grossProfit,
        profitMargin: financials.profitMargin,
      };
    });

    ranking.sort((a, b) => b.profitMargin - a.profitMargin);

    return { ranking };
  }
}

export namespace GetProductsRankingUseCase {
  export type Input = {
    accountId: string;
  };

  export type RankedProduct = {
    productId: string;
    productName: string;
    salePrice: number;
    totalCost: number;
    unitCost: number;
    grossProfit: number;
    profitMargin: number;
  };

  export type Output = {
    ranking: RankedProduct[];
  };
}
