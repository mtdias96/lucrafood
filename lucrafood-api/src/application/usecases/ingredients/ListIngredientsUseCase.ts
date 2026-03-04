import { PaginationService } from '@application/service/PaginationService';
import { IngredientRepository } from '@infra/database/drizzle/repository/ingredients/IngredientRepository';
import { Injectable } from '@kernel/decorators/Injactable';
import { PackageUnit } from '@shared/types/PackageUnit';

@Injectable()
export class ListIngredientsUseCase {
  constructor(private readonly ingredientRepository: IngredientRepository) { }

  async execute(input: ListIngredientsUseCase.Input): Promise<ListIngredientsUseCase.Output> {
    const { page, limit, offset } = PaginationService.validate(
      { page: input.page, limit: input.limit },
    );

    const [rows, total] = await Promise.all([
      this.ingredientRepository.findPageByAccount({ accountId: input.accountId, offset, limit }),
      this.ingredientRepository.countByAccount(input.accountId),
    ]);

    return {
      ingredients: rows.map(r => ({
        id: r.id,
        name: r.name,
        baseUnit: r.baseUnit,
        createdAt: r.createdAt,
      })),
      meta: {
        page,
        limit,
        pageItems: rows.length,
        totalPages: Math.ceil(total / limit),
        totalIngredients: total,
      },
    };
  }
}

export namespace ListIngredientsUseCase {
  export type Input = {
    accountId: string;
    page?: number;
    limit?: number;
  };

  export type Output = {
    ingredients: Array<{
      id: string;
      name: string;
      baseUnit: PackageUnit;
      createdAt: Date;
    }>;
    meta: {
      page: number;
      limit: number;
      pageItems: number;
      totalPages: number;
      totalIngredients: number;
    };
  };
}
