import { ProductFinancialService } from '@application/service/ProductFinancialService';
import { ingredientPurchaseRepository } from '@infra/database/drizzle/repository/ingredients/ingredientPurchaseRepository';
import { ProductRepository } from '@infra/database/drizzle/repository/products/productRepository';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class GetMonthlyReportUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly ingredientPurchaseRepo: ingredientPurchaseRepository,
  ) { }

  async execute(input: GetMonthlyReportUseCase.Input): Promise<GetMonthlyReportUseCase.Output> {
    const { accountId, month } = input;

    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

    const products = await this.productRepository.findAllWithRecipeByAccount({ accountId });

    const allIngredientIds = [...new Set(
      products.flatMap(p => p.items.map(i => i.ingredientId)),
    )];

    const allPurchases = allIngredientIds.length > 0
      ? await this.ingredientPurchaseRepo.findAllByIngredientIds({ ingredientIds: allIngredientIds, accountId })
      : [];

    const monthPurchases = allPurchases.filter(p => {
      const d = new Date(p.purchasedAt);
      return d >= startDate && d <= endDate;
    });

    const totalPurchaseCost = monthPurchases.reduce((sum, p) => sum + Number(p.totalPrice), 0);

    const latestPurchases = allIngredientIds.length > 0
      ? await this.ingredientPurchaseRepo.findLastByIngredientIds({ ingredientIds: allIngredientIds, accountId })
      : [];

    const unitPriceByIngredient = new Map<string, number>();
    for (const purchase of latestPurchases) {
      unitPriceByIngredient.set(purchase.ingredientId, Number(purchase.unitPrice));
    }

    const purchasesByIngredient = new Map<string, typeof monthPurchases>();
    for (const p of monthPurchases) {
      const list = purchasesByIngredient.get(p.ingredientId) ?? [];
      list.push(p);
      purchasesByIngredient.set(p.ingredientId, list);
    }

    const ingredientNames = new Map<string, string>();
    for (const product of products) {
      for (const item of product.items) {
        if (item.ingredientName) {
          ingredientNames.set(item.ingredientId, item.ingredientName);
        }
      }
    }

    const ingredientCosts: GetMonthlyReportUseCase.IngredientCost[] = [];
    for (const [ingredientId, purchases] of purchasesByIngredient) {
      const total = purchases.reduce((sum, p) => sum + Number(p.totalPrice), 0);
      ingredientCosts.push({
        ingredientId,
        ingredientName: ingredientNames.get(ingredientId) ?? 'Desconhecido',
        totalSpent: Number(total.toFixed(2)),
        purchaseCount: purchases.length,
      });
    }
    ingredientCosts.sort((a, b) => b.totalSpent - a.totalSpent);

    const productFinancials: GetMonthlyReportUseCase.ProductFinancial[] = products.map(product => {
      const { financials } = ProductFinancialService.calculate(product, unitPriceByIngredient);

      return {
        productId: product.id,
        productName: product.name,
        salePrice: Number(product.salePrice),
        unitCost: financials.unitCost,
        grossProfit: financials.grossProfit,
        profitMargin: financials.profitMargin,
      };
    });
    productFinancials.sort((a, b) => b.profitMargin - a.profitMargin);

    const totalRevenuePotential = productFinancials.reduce((sum, p) => sum + p.salePrice, 0);
    const totalProductionCost = productFinancials.reduce((sum, p) => sum + p.unitCost, 0);
    const totalGrossProfit = productFinancials.reduce((sum, p) => sum + p.grossProfit, 0);
    const avgMargin = productFinancials.length > 0
      ? productFinancials.reduce((sum, p) => sum + p.profitMargin, 0) / productFinancials.length
      : 0;

    const monthNames = [
      'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ];

    return {
      month,
      monthLabel: `${monthNames[monthNum - 1]} ${year}`,
      summary: {
        totalPurchaseCost: Number(totalPurchaseCost.toFixed(2)),
        totalRevenuePotential: Number(totalRevenuePotential.toFixed(2)),
        totalProductionCost: Number(totalProductionCost.toFixed(2)),
        totalGrossProfit: Number(totalGrossProfit.toFixed(2)),
        avgProfitMargin: Number(avgMargin.toFixed(2)),
        productCount: products.length,
        ingredientPurchaseCount: monthPurchases.length,
      },
      ingredientCosts,
      productFinancials,
    };
  }
}

export namespace GetMonthlyReportUseCase {
  export type Input = {
    accountId: string;
    month: string; // YYYY-MM
  };

  export type IngredientCost = {
    ingredientId: string;
    ingredientName: string;
    totalSpent: number;
    purchaseCount: number;
  };

  export type ProductFinancial = {
    productId: string;
    productName: string;
    salePrice: number;
    unitCost: number;
    grossProfit: number;
    profitMargin: number;
  };

  export type Summary = {
    totalPurchaseCost: number;
    totalRevenuePotential: number;
    totalProductionCost: number;
    totalGrossProfit: number;
    avgProfitMargin: number;
    productCount: number;
    ingredientPurchaseCount: number;
  };

  export type Output = {
    month: string;
    monthLabel: string;
    summary: Summary;
    ingredientCosts: IngredientCost[];
    productFinancials: ProductFinancial[];
  };
}
