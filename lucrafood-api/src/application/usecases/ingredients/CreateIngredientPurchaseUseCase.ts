
import { IngredientPurchase } from '@application/entities/IngredientsPurchase';
import { NotFound } from '@application/errors/http/NotFound';
import { UnitPriceService } from '@application/service/UnitBaseCalculator';
import { DrizzleClient } from '@infra/database/drizzle/Client';
import { ingredientPurchaseRepository } from '@infra/database/drizzle/repository/ingredients/ingredientPurchaseRepository';
import { IngredientRepository } from '@infra/database/drizzle/repository/ingredients/IngredientRepository';
import { IngredientStoreRepository } from '@infra/database/drizzle/repository/ingredients/IngredientStoreRepository';
import { StockRepository } from '@infra/database/drizzle/repository/stock/StockRepository';

import { Injectable } from '@kernel/decorators/Injactable';
import { PackageUnit } from '@shared/types/PackageUnit';

@Injectable()
export class CreateIngredientPurchaseUseCase {
  constructor(
    private readonly ingredientRepository: IngredientRepository,
    private readonly ingredientPurchaseRepository: ingredientPurchaseRepository,
    private readonly ingredientStoreRepository: IngredientStoreRepository,
    private readonly stockRepository: StockRepository,
    private readonly db: DrizzleClient,
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

    const purchase = new IngredientPurchase({ ingredientId, accountId, storeId, packageQty, packageUnit, totalPrice, unitPrice, purchasedAt });
    const baseQty = UnitPriceService.toBaseQty(packageQty, packageUnit);

    const created = await this.db.transaction(async (tx) => {
      const result = await this.ingredientPurchaseRepository.create(purchase, tx);

      await this.stockRepository.incrementIngredientStock({
        ingredientId,
        accountId,
        qtyToAdd: baseQty,
        unit: packageUnit,
      }, tx);

      return result;
    });

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
