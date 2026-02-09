
import { IngredientPurchase } from '@application/entities/IngredientsPurchase';
import { NotFound } from '@application/errors/http/NotFound';
import { UnitPriceService } from '@application/service/UnitBaseCalculator';
import { ingredientPurchaseRepository } from '@infra/database/drizzle/repository/ingredients/ingredientPurchaseRepository';
import { IngredientRepository } from '@infra/database/drizzle/repository/ingredients/IngredientRepository';
import { IngredientStoreRepository } from '@infra/database/drizzle/repository/ingredients/IngredientStoreRepository';

import { Injectable } from '@kernel/decorators/Injactable';
import { PackageUnit } from '@shared/types/PackageUnit';

@Injectable()
export class CreateIngredientPurchaseUseCase {
  constructor(
    private readonly ingredientRepository: IngredientRepository,
    private readonly ingredientPurchaseRepository: ingredientPurchaseRepository,
    private readonly ingredientStoreRepository: IngredientStoreRepository,
  ) { };

  async execute(input: CreateIngredientPurchaseUseCase.Input): Promise<CreateIngredientPurchaseUseCase.Output> {
    const { accountId, ingredientId, storeId, packageQty, packageUnit, totalPrice, purchasedAt } = input;

    const ingredientExists = await this.ingredientRepository.findById({ ingredientId, accountId });

    if (!ingredientExists) { throw new NotFound('Ingredient not found'); }

    if (storeId) {
      const storeOwned = await this.ingredientStoreRepository.findById({ storeId, accountId });
      if (!storeOwned) { throw new NotFound('Store not found'); }
    }

    const unitPrice = UnitPriceService.calcUnitPrice(
      input.totalPrice,
      input.packageQty,
      input.packageUnit,
    );

    const ingredient = new IngredientPurchase({ ingredientId, storeId, packageQty, packageUnit, totalPrice, unitPrice, purchasedAt });

    const created = await this.ingredientPurchaseRepository.create(ingredient);

    return {
      ingredientPurchase: created,
    };
  }
}

export namespace CreateIngredientPurchaseUseCase {
  export type Input = {
    accountId: string;
    ingredientId: string;
    storeId?: string | null;
    packageQty: number;
    packageUnit: PackageUnit;
    totalPrice: number;
    purchasedAt?: Date
  }
  export type Output = {
    ingredientPurchase: {
      ingredientId: string;
      storeId?: string | null;
      packageQty: number;
      packageUnit: PackageUnit;
      totalPrice: number;
      unitPrice: number;
      purchasedAt: Date
    }
  }
}
