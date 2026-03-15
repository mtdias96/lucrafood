import { PackageUnit } from '@shared/types/PackageUnit';

import { UnitPriceService } from './UnitBaseCalculator';

export class ProductFinancialService {
  static calculate(
    product: ProductFinancialService.ProductInput,
    unitPriceByIngredient: Map<string, number>,
  ): ProductFinancialService.ProductFinancials {
    const salePrice = Number(product.salePrice);

    let totalCost = 0;

    const items = product.items.map(item => {
      const ingredientUnitPrice = unitPriceByIngredient.get(item.ingredientId);
      let cost: number | null = null;

      if (ingredientUnitPrice !== undefined) {
        const baseQty = UnitPriceService.toBaseQty(Number(item.quantity), item.unit as PackageUnit);
        const rawCost = baseQty * ingredientUnitPrice;
        cost = Number(rawCost.toFixed(2));
        totalCost += rawCost;
      }

      return {
        id: item.id,
        ingredientId: item.ingredientId,
        ingredientName: item.ingredientName,
        quantity: item.quantity,
        unit: item.unit,
        cost,
      };
    });

    totalCost = Number(totalCost.toFixed(2));

    const unitCost = product.yieldQty > 0
      ? Number((totalCost / product.yieldQty).toFixed(2))
      : 0;

    const grossProfit = Number((salePrice - unitCost).toFixed(2));

    const profitMargin = salePrice > 0
      ? Number(((grossProfit / salePrice) * 100).toFixed(2))
      : 0;

    const targetMargin = product.targetMargin ? Number(product.targetMargin) : null;

    const suggestedPrice = targetMargin !== null && targetMargin < 100 && unitCost > 0
      ? Number((unitCost / (1 - targetMargin / 100)).toFixed(2))
      : null;

    return {
      items,
      financials: { totalCost, unitCost, grossProfit, profitMargin, suggestedPrice },
    };
  }
}

export namespace ProductFinancialService {
  export type ProductInput = {
    yieldQty: number;
    salePrice: string;
    targetMargin?: string | null;
    items: Array<{
      id: string;
      ingredientId: string;
      ingredientName: string | null;
      quantity: string;
      unit: string;
    }>;
  };

  export type ProductFinancials = {
    items: Array<{
      id: string;
      ingredientId: string;
      ingredientName: string | null;
      quantity: string;
      unit: string;
      cost: number | null;
    }>;
    financials: {
      totalCost: number;
      unitCost: number;
      grossProfit: number;
      profitMargin: number;
      suggestedPrice: number | null;
    };
  };
}
