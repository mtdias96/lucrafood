
import { ProductFinancialService } from '@application/service/ProductFinancialService';
import { NotFound } from '@application/errors/http/NotFound';
import { ingredientPurchaseRepository } from '@infra/database/drizzle/repository/ingredients/ingredientPurchaseRepository';
import { ProductRepository } from '@infra/database/drizzle/repository/products/productRepository';
import { IngredientRepository } from '@infra/database/drizzle/repository/ingredients/IngredientRepository';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class SimulateIngredientPriceUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly ingredientRepository: IngredientRepository,
    private readonly ingredientPurchaseRepo: ingredientPurchaseRepository,
  ) { }

  async execute(input: SimulateIngredientPriceUseCase.Input): Promise<SimulateIngredientPriceUseCase.Output> {
    const { accountId, ingredientId, simulatedUnitPrice } = input;

    const ingredient = await this.ingredientRepository.findById({ ingredientId, accountId });

    if (!ingredient) {
      throw new NotFound('Ingredient not found');
    }

    const allProducts = await this.productRepository.findAllWithRecipeByAccount({ accountId });

    const affectedProducts = allProducts.filter(
      p => p.items.some(i => i.ingredientId === ingredientId),
    );

    if (affectedProducts.length === 0) {
      return {
        ingredientId,
        ingredientName: ingredient.name,
        simulatedUnitPrice,
        affectedProducts: [],
      };
    }

    const allIngredientIds = [...new Set(
      affectedProducts.flatMap(p => p.items.map(i => i.ingredientId)),
    )];

    const latestPurchases = await this.ingredientPurchaseRepo.findLastByIngredientIds({
      ingredientIds: allIngredientIds,
      accountId,
    });

    const currentPriceMap = new Map<string, number>();
    for (const purchase of latestPurchases) {
      currentPriceMap.set(purchase.ingredientId, Number(purchase.unitPrice));
    }

    const simulatedPriceMap = new Map(currentPriceMap);
    simulatedPriceMap.set(ingredientId, simulatedUnitPrice);

    const results = affectedProducts.map(product => {
      const { financials: current } = ProductFinancialService.calculate(product, currentPriceMap);
      const { financials: simulated } = ProductFinancialService.calculate(product, simulatedPriceMap);

      return {
        productId: product.id,
        productName: product.name,
        salePrice: Number(product.salePrice),
        current,
        simulated,
      };
    });

    return {
      ingredientId,
      ingredientName: ingredient.name,
      simulatedUnitPrice,
      affectedProducts: results,
    };
  }
}

export namespace SimulateIngredientPriceUseCase {
  export type Input = {
    accountId: string;
    ingredientId: string;
    simulatedUnitPrice: number;
  };

  export type Financials = {
    totalCost: number;
    unitCost: number;
    grossProfit: number;
    profitMargin: number;
  };

  export type AffectedProduct = {
    productId: string;
    productName: string;
    salePrice: number;
    current: Financials;
    simulated: Financials;
  };

  export type Output = {
    ingredientId: string;
    ingredientName: string;
    simulatedUnitPrice: number;
    affectedProducts: AffectedProduct[];
  };
}
