
import { ProductFinancialService } from '@application/service/ProductFinancialService';
import { PaginationService } from '@application/service/PaginationService';
import { ingredientPurchaseRepository } from '@infra/database/drizzle/repository/ingredients/ingredientPurchaseRepository';
import { ProductRepository } from '@infra/database/drizzle/repository/products/productRepository';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class ListProductsWithFinancialsUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly ingredientPurchaseRepo: ingredientPurchaseRepository,
  ) { };

  async execute(input: ListProductsWithFinancialsUseCase.Input): Promise<ListProductsWithFinancialsUseCase.Output> {
    const { accountId } = input;

    const { page, limit, offset } = PaginationService.validate(
      { page: input.page, limit: input.limit },
      { defaultLimit: 10 },
    );

    const [products, total] = await Promise.all([
      this.productRepository.findPageWithRecipeByAccount({ accountId, offset, limit }),
      this.productRepository.countByAccount(input.accountId),
    ]);

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

    const productsWithFinancials = products.map(product => {
      const { items, financials } = ProductFinancialService.calculate(product, unitPriceByIngredient);

      return {
        id: product.id,
        name: product.name,
        yieldQty: product.yieldQty,
        yieldUnit: product.yieldUnit,
        salePrice: Number(product.salePrice),
        createdAt: product.createdAt,
        items,
        financials,
      };
    });

    return {
      products: productsWithFinancials,
      meta: {
        limit,
        page,
        pageItems: products.length,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
      },
    };
  }
}

export namespace ListProductsWithFinancialsUseCase {
  export type Input = {
    accountId: string;
    page?: number;
    limit?: number;
  }

  export type Output = {
    products: Array<{
      id: string;
      name: string;
      yieldQty: number;
      yieldUnit: string;
      salePrice: number;
      createdAt: Date;
      items: Array<{
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
      };
    }>;
    meta: {
      page: number;
      limit: number;
      pageItems: number;
      totalPages: number;
      totalProducts: number;
    };
  }
}
