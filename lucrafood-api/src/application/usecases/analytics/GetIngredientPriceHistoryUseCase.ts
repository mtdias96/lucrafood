
import { NotFound } from '@application/errors/http/NotFound';
import { IngredientRepository } from '@infra/database/drizzle/repository/ingredients/IngredientRepository';
import { ingredientPurchaseRepository } from '@infra/database/drizzle/repository/ingredients/ingredientPurchaseRepository';
import { Injectable } from '@kernel/decorators/Injactable';
import { PackageUnit } from '@shared/types/PackageUnit';

@Injectable()
export class GetIngredientPriceHistoryUseCase {
  constructor(
    private readonly ingredientRepository: IngredientRepository,
    private readonly purchaseRepository: ingredientPurchaseRepository,
  ) { }

  async execute(input: GetIngredientPriceHistoryUseCase.Input): Promise<GetIngredientPriceHistoryUseCase.Output> {
    const { accountId, ingredientId } = input;

    const ingredient = await this.ingredientRepository.findById({ ingredientId, accountId });

    if (!ingredient) {
      throw new NotFound('Ingredient not found');
    }

    const purchases = await this.purchaseRepository.findAllByIngredient({ ingredientId, accountId });

    const history: GetIngredientPriceHistoryUseCase.HistoryEntry[] = purchases.map(purchase => ({
      date: purchase.purchasedAt,
      totalPrice: Number(purchase.totalPrice),
      packageQty: Number(purchase.packageQty),
      packageUnit: purchase.packageUnit,
      unitPrice: Number(purchase.unitPrice),
    }));

    return {
      ingredientId: ingredient.id,
      ingredientName: ingredient.name,
      history,
    };
  }
}

export namespace GetIngredientPriceHistoryUseCase {
  export type Input = {
    accountId: string;
    ingredientId: string;
  };

  export type HistoryEntry = {
    date: Date;
    totalPrice: number;
    packageQty: number;
    packageUnit: PackageUnit;
    unitPrice: number;
  };

  export type Output = {
    ingredientId: string;
    ingredientName: string;
    history: HistoryEntry[];
  };
}
