import { NotFound } from '@application/errors/http/NotFound';
import { PaginationService } from '@application/service/PaginationService';
import { IngredientRepository } from '@infra/database/drizzle/repository/ingredients/IngredientRepository';
import { ingredientPurchaseRepository } from '@infra/database/drizzle/repository/ingredients/ingredientPurchaseRepository';
import { Injectable } from '@kernel/decorators/Injactable';
import { PackageUnit } from '@shared/types/PackageUnit';

@Injectable()
export class ListIngredientPurchasesUseCase {
  constructor(
    private readonly ingredientRepository: IngredientRepository,
    private readonly purchaseRepository: ingredientPurchaseRepository,
  ) { }

  async execute(input: ListIngredientPurchasesUseCase.Input): Promise<ListIngredientPurchasesUseCase.Output> {
    const { page, limit, offset } = PaginationService.validate(
      { page: input.page, limit: input.limit },
    );

    const ingredient = await this.ingredientRepository.findById({
      ingredientId: input.ingredientId,
      accountId: input.accountId,
    });

    if (!ingredient) {
      throw new NotFound('Ingredient not found');
    }

    const [rows, total] = await Promise.all([
      this.purchaseRepository.findPageByIngredient({
        ingredientId: input.ingredientId,
        accountId: input.accountId,
        offset,
        limit,
      }),
      this.purchaseRepository.countByIngredient({
        ingredientId: input.ingredientId,
        accountId: input.accountId,
      }),
    ]);

    return {
      purchases: rows.map(r => ({
        id: r.id,
        packageQty: Number(r.packageQty),
        packageUnit: r.packageUnit,
        totalPrice: Number(r.totalPrice),
        unitPrice: Number(r.unitPrice),
        storeId: r.storeId ?? null,
        purchasedAt: r.purchasedAt,
      })),
      meta: {
        page,
        limit,
        pageItems: rows.length,
        totalPages: Math.ceil(total / limit),
        totalPurchases: total,
      },
    };
  }
}

export namespace ListIngredientPurchasesUseCase {
  export type Input = {
    ingredientId: string;
    accountId: string;
    page?: number;
    limit?: number;
  };

  export type Output = {
    purchases: Array<{
      id: string;
      packageQty: number;
      packageUnit: PackageUnit;
      totalPrice: number;
      unitPrice: number;
      storeId: string | null;
      purchasedAt: Date;
    }>;
    meta: {
      page: number;
      limit: number;
      pageItems: number;
      totalPages: number;
      totalPurchases: number;
    };
  };
}
