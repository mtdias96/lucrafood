
import { InvalidPaginationError } from '@application/errors/http/InvalidPaginationError';
import { ProductRepository } from '@infra/database/drizzle/repository/products/productRepository';

import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class ListProductsWithRecipeUseCase {
  constructor(
    private readonly productRepository: ProductRepository,

  ) { };

  async execute(input: ListProductsWithRecipeUseCase.Input): Promise<ListProductsWithRecipeUseCase.Output> {
    const { accountId } = input;

    const page = input.page ?? 1;
    const limit = input.limit ?? 10;

    const isInvalidLimit = !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 50;
    const isInvalidPage = !Number.isInteger(page) ||
      page < 1 ||
      page > 50;

    if (isInvalidLimit) {
      throw new InvalidPaginationError('limit must be between 1 and 50');
    }

    if (isInvalidPage) {
      throw new InvalidPaginationError('page must be between 1 and 50');
    }

    const offset = (page - 1) * limit;

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
