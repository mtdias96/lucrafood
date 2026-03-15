
import { ProductFinancialService } from '@application/service/ProductFinancialService';
import { NotFound } from '@application/errors/http/NotFound';
import { ingredientPurchaseRepository } from '@infra/database/drizzle/repository/ingredients/ingredientPurchaseRepository';
import { ProductRepository } from '@infra/database/drizzle/repository/products/productRepository';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class GetProductFinancialsUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly ingredientPurchaseRepo: ingredientPurchaseRepository,
  ) { }

  async execute(input: GetProductFinancialsUseCase.Input): Promise<GetProductFinancialsUseCase.Output> {
    const { accountId, productId } = input;

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

    const { items, financials } = ProductFinancialService.calculate(product, unitPriceByIngredient);

    return {
      product: {
        id: product.id,
        name: product.name,
        yieldQty: product.yieldQty,
        yieldUnit: product.yieldUnit,
        salePrice: Number(product.salePrice),
        targetMargin: product.targetMargin ? Number(product.targetMargin) : null,
        createdAt: product.createdAt,
        items,
        financials,
      },
    };
  }
}

export namespace GetProductFinancialsUseCase {
  export type Input = {
    accountId: string;
    productId: string;
  };

  export type Output = {
    product: {
      id: string;
      name: string;
      yieldQty: number;
      yieldUnit: string;
      salePrice: number;
      targetMargin: number | null;
      createdAt: Date;
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
  };
}
