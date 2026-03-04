
import { PaginationService } from '@application/service/PaginationService';
import { ProductRepository } from '@infra/database/drizzle/repository/products/productRepository';

import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class ListProductsWithRecipeUseCase {
  constructor(
    private readonly productRepository: ProductRepository,

  ) { };

  async execute(input: ListProductsWithRecipeUseCase.Input): Promise<ListProductsWithRecipeUseCase.Output> {
    const { accountId } = input;

    const { page, limit, offset } = PaginationService.validate(
      { page: input.page, limit: input.limit },
      { defaultLimit: 10 },
    );

    const [products, total] = await Promise.all([
      this.productRepository.findPageWithRecipeByAccount({ accountId, offset, limit }),
      this.productRepository.countByAccount(input.accountId),
    ]);

    return {
      products,
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

export namespace ListProductsWithRecipeUseCase {
  export type Input = {
    accountId: string;
    page?: number;
    limit?: number;
  }

  export type Output = {
    products: {
      id: string;
      name: string;
      yieldQty: number;
      yieldUnit: string;
      createdAt: Date;
      items: Array<{
        ingredientId: string;
        ingredientName: string | null;
        quantity: string;
        unit: string;
      }>;
    }[],
    meta: {
      page: number;
      limit: number;
      pageItems: number
      totalPages: number
      totalProducts: number
    }
  }
}
