import { ProductFinancialService } from '@application/service/ProductFinancialService';
import { AlertRepository } from '@infra/database/drizzle/repository/alerts/AlertRepository';
import { ingredientPurchaseRepository } from '@infra/database/drizzle/repository/ingredients/ingredientPurchaseRepository';
import { ProductRepository } from '@infra/database/drizzle/repository/products/productRepository';
import { Injectable } from '@kernel/decorators/Injactable';

const PRICE_INCREASE_THRESHOLD = 10;

@Injectable()
export class CheckAlertsUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly ingredientPurchaseRepo: ingredientPurchaseRepository,
    private readonly alertRepository: AlertRepository,
  ) { }

  async execute(input: CheckAlertsUseCase.Input): Promise<CheckAlertsUseCase.Output> {
    const { accountId } = input;
    const alertsToCreate: AlertRepository.CreateInput[] = [];

    const products = await this.productRepository.findAllWithRecipeByAccount({ accountId });

    const allIngredientIds = [...new Set(
      products.flatMap(p => p.items.map(i => i.ingredientId)),
    )];

    if (allIngredientIds.length > 0) {
      const priceIncreaseAlerts = await this.checkIngredientPriceIncreases(accountId, allIngredientIds);
      alertsToCreate.push(...priceIncreaseAlerts);
    }

    if (products.length > 0 && allIngredientIds.length > 0) {
      const latestPurchases = await this.ingredientPurchaseRepo.findLastByIngredientIds({
        ingredientIds: allIngredientIds,
        accountId,
      });

      const unitPriceByIngredient = new Map<string, number>();
      for (const purchase of latestPurchases) {
        unitPriceByIngredient.set(purchase.ingredientId, Number(purchase.unitPrice));
      }

      for (const product of products) {
        const { financials } = ProductFinancialService.calculate(product, unitPriceByIngredient);

        if (Number(product.salePrice) > 0 && financials.unitCost > Number(product.salePrice)) {
          alertsToCreate.push({
            accountId,
            type: 'PRODUCT_UNPROFITABLE',
            message: `O produto "${product.name}" está com custo (R$ ${financials.unitCost.toFixed(2)}) acima do preço de venda (R$ ${Number(product.salePrice).toFixed(2)}).`,
            metadata: JSON.stringify({ productId: product.id, unitCost: financials.unitCost, salePrice: Number(product.salePrice) }),
          });
        }

        const targetMargin = product.targetMargin ? Number(product.targetMargin) : null;
        if (targetMargin !== null && financials.profitMargin < targetMargin) {
          alertsToCreate.push({
            accountId,
            type: 'MARGIN_BELOW_TARGET',
            message: `O produto "${product.name}" está com margem (${financials.profitMargin.toFixed(1)}%) abaixo da meta (${targetMargin.toFixed(1)}%).`,
            metadata: JSON.stringify({ productId: product.id, currentMargin: financials.profitMargin, targetMargin }),
          });
        }
      }
    }

    if (alertsToCreate.length > 0) {
      await this.alertRepository.createMany(alertsToCreate);
    }

    return { alertsCreated: alertsToCreate.length };
  }

  private async checkIngredientPriceIncreases(accountId: string, ingredientIds: string[]): Promise<AlertRepository.CreateInput[]> {
    const alerts: AlertRepository.CreateInput[] = [];

    const allPurchases = await this.ingredientPurchaseRepo.findAllByIngredientIds({
      ingredientIds,
      accountId,
    });

    const purchasesByIngredient = new Map<string, typeof allPurchases>();
    for (const purchase of allPurchases) {
      const current = purchasesByIngredient.get(purchase.ingredientId) ?? [];
      current.push(purchase);
      purchasesByIngredient.set(purchase.ingredientId, current);
    }

    for (const [ingredientId, purchases] of purchasesByIngredient) {
      if (purchases.length < 2) continue;

      const sorted = purchases.sort((a, b) =>
        new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime(),
      );

      const latest = Number(sorted[0].unitPrice);
      const previous = Number(sorted[1].unitPrice);

      if (previous > 0) {
        const increasePercent = ((latest - previous) / previous) * 100;

        if (increasePercent >= PRICE_INCREASE_THRESHOLD) {
          alerts.push({
            accountId,
            type: 'INGREDIENT_PRICE_INCREASE',
            message: `O ingrediente teve aumento de ${increasePercent.toFixed(1)}% no preço unitário (de R$ ${previous.toFixed(4)} para R$ ${latest.toFixed(4)}).`,
            metadata: JSON.stringify({ ingredientId, previousPrice: previous, currentPrice: latest, increasePercent }),
          });
        }
      }
    }

    return alerts;
  }
}

export namespace CheckAlertsUseCase {
  export type Input = {
    accountId: string;
  };

  export type Output = {
    alertsCreated: number;
  };
}
