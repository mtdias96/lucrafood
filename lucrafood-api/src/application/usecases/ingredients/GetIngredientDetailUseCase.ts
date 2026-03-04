import { NotFound } from '@application/errors/http/NotFound';
import { IngredientRepository } from '@infra/database/drizzle/repository/ingredients/IngredientRepository';
import { ingredientPurchaseRepository } from '@infra/database/drizzle/repository/ingredients/ingredientPurchaseRepository';
import { Injectable } from '@kernel/decorators/Injactable';
import { PackageUnit } from '@shared/types/PackageUnit';

@Injectable()
export class GetIngredientDetailUseCase {
  constructor(
    private readonly ingredientRepository: IngredientRepository,
    private readonly purchaseRepository: ingredientPurchaseRepository,
  ) { }

  async execute(input: GetIngredientDetailUseCase.Input): Promise<GetIngredientDetailUseCase.Output> {
    const ingredient = await this.ingredientRepository.findById({
      ingredientId: input.ingredientId,
      accountId: input.accountId,
    });

    if (!ingredient) {
      throw new NotFound('Ingredient not found');
    }

    const stats = await this.purchaseRepository.findStatsByIngredient({
      ingredientId: input.ingredientId,
      accountId: input.accountId,
    });

    return {
      ingredient: {
        id: ingredient.id,
        name: ingredient.name,
        baseUnit: ingredient.baseUnit,
        createdAt: ingredient.createdAt,
      },
      priceStats: {
        currentPrice: stats.currentPrice,
        minPrice: stats.minPrice,
        maxPrice: stats.maxPrice,
        avgPrice: stats.avgPrice,
        purchaseCount: stats.purchaseCount,
      },
    };
  }
}

export namespace GetIngredientDetailUseCase {
  export type Input = {
    ingredientId: string;
    accountId: string;
  };

  export type Output = {
    ingredient: {
      id: string;
      name: string;
      baseUnit: PackageUnit;
      createdAt: Date;
    };
    priceStats: {
      currentPrice: number | null;
      minPrice: number | null;
      maxPrice: number | null;
      avgPrice: number | null;
      purchaseCount: number;
    };
  };
}
