
import { ProductFinancialService } from '@application/service/ProductFinancialService';
import { NotFound } from '@application/errors/http/NotFound';
import { ingredientPurchaseRepository } from '@infra/database/drizzle/repository/ingredients/ingredientPurchaseRepository';
import { ProductRepository } from '@infra/database/drizzle/repository/products/productRepository';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class SimulateSalePriceUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly ingredientPurchaseRepo: ingredientPurchaseRepository,
  ) { }

  async execute(input: SimulateSalePriceUseCase.Input): Promise<SimulateSalePriceUseCase.Output> {
    const { accountId, productId, simulatedSalePrice } = input;

    const product = await this.productRepository.findOneWithRecipeByAccount({ productId, accountId });

    if (!product) {
      throw new NotFound('Product not found');
    }

    const ingredientIds = product.items.map(i => i.ingredientId);

    const latestPurchases = ingredientIds.length > 0
      ? await this.ingredientPurchaseRepo.findLastByIngredientIds({ ingredientIds, accountId })
      : [];

    const unitPriceByIngredient = new Map<string, number>();
    for (const purchase of latestPurchases) {
      unitPriceByIngredient.set(purchase.ingredientId, Number(purchase.unitPrice));
    }

    const { financials: current } = ProductFinancialService.calculate(product, unitPriceByIngredient);

    const simulatedProduct = { ...product, salePrice: simulatedSalePrice.toFixed(2) };
    const { financials: simulated } = ProductFinancialService.calculate(simulatedProduct, unitPriceByIngredient);

    return {
      productId: product.id,
      productName: product.name,
      currentSalePrice: Number(product.salePrice),
      simulatedSalePrice,
      current,
      simulated,
    };
  }
}

export namespace SimulateSalePriceUseCase {
  export type Input = {
    accountId: string;
    productId: string;
    simulatedSalePrice: number;
  };

  export type Financials = {
    totalCost: number;
    unitCost: number;
    grossProfit: number;
    profitMargin: number;
    suggestedPrice: number | null;
  };

  export type Output = {
    productId: string;
    productName: string;
    currentSalePrice: number;
    simulatedSalePrice: number;
    current: Financials;
    simulated: Financials;
  };
}
