import { NotFound } from '@application/errors/http/NotFound';
import { ProductRecipeRepository } from '@infra/database/drizzle/repository/products/productRecipeRepository';
import { Injectable } from '@kernel/decorators/Injactable';
import { PackageUnit } from '@shared/types/PackageUnit';

@Injectable()
export class UpdateProductRecipeItemUseCase {
  constructor(private readonly productRecipeRepository: ProductRecipeRepository) { }

  async execute(input: UpdateProductRecipeItemUseCase.Input): Promise<void> {
    const { accountId, productId, recipeItemId, quantityUsed, unitUsed } = input;

    const result = await this.productRecipeRepository.updateItem({
      accountId,
      productId,
      recipeItemId,
      quantityUsed,
      unitUsed,
    });

    if (result === 'not_found') {
      throw new NotFound('Recipe item not found');
    }
  }
}

export namespace UpdateProductRecipeItemUseCase {
  export type Input = {
    accountId: string;
    productId: string;
    recipeItemId: string;
    quantityUsed: number;
    unitUsed: PackageUnit;
  }
}
