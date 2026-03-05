
import { NotFound } from '@application/errors/http/NotFound';
import { IngredientRepository } from '@infra/database/drizzle/repository/ingredients/IngredientRepository';
import { StockRepository } from '@infra/database/drizzle/repository/stock/StockRepository';
import { Injectable } from '@kernel/decorators/Injactable';
import { PackageUnit } from '@shared/types/PackageUnit';

@Injectable()
export class UpdateIngredientStockUseCase {
  constructor(
    private readonly ingredientRepository: IngredientRepository,
    private readonly stockRepository: StockRepository,
  ) { }

  async execute(input: UpdateIngredientStockUseCase.Input): Promise<UpdateIngredientStockUseCase.Output> {
    const { accountId, ingredientId, currentQty, minQty, unit } = input;

    const ingredient = await this.ingredientRepository.findById({ ingredientId, accountId });

    if (!ingredient) {
      throw new NotFound('Ingredient not found');
    }

    const row = await this.stockRepository.upsertIngredientStock({
      ingredientId,
      accountId,
      currentQty,
      minQty: minQty ?? 0,
      unit,
    });

    const qty = Number(row.currentQty);
    const min = Number(row.minQty);

    return {
      ingredientId: row.ingredientId,
      currentQty: qty,
      minQty: min,
      unit: row.unit,
      lowStock: qty < min,
    };
  }
}

export namespace UpdateIngredientStockUseCase {
  export type Input = {
    accountId: string;
    ingredientId: string;
    currentQty: number;
    minQty?: number;
    unit: PackageUnit;
  };

  export type Output = {
    ingredientId: string;
    currentQty: number;
    minQty: number;
    unit: PackageUnit;
    lowStock: boolean;
  };
}
