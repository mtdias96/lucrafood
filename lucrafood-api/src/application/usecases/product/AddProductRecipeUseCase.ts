
import { ProductRecipe } from '@application/entities/ProductRecipe';
import { Conflict } from '@application/errors/http/Conflict';
import { ProductRecipeRepository } from '@infra/database/drizzle/repository/products/productRecipeRepository';

import { Injectable } from '@kernel/decorators/Injactable';
import { PackageUnit } from '@shared/types/PackageUnit';

@Injectable()
export class AddProductRecipeUseCase {
  constructor(
    private readonly productRecipeRepository: ProductRecipeRepository,

  ) { };

  async execute(input: AddProductRecipeUseCase.Input): Promise<AddProductRecipeUseCase.Output> {
    const { accountId, productId, productRecipe } = input;

    const alreadyExists = await this.productRecipeRepository.findById({ accountId, productId });

    if (alreadyExists) {
      throw new Conflict('Product recipe already exists');
    }

    const ingredientsItem = productRecipe.map(({ ingredientId, quantityUsed, unitUsed }) => new ProductRecipe({ accountId, ingredientId, productId, quantityUsed, unitUsed }));

    const returning = await this.productRecipeRepository.addRecipeItem(ingredientsItem);

    return returning;
  }
}

export namespace AddProductRecipeUseCase {
  export type Input = {
    accountId: string;
    productId: string;

    productRecipe: {
      ingredientId: string;
      quantityUsed: number
      unitUsed: PackageUnit
      createdAt?: Date;
    }[]
  }

  export type Output = {
    id: string;
    ingredientId: string;
    productId: string;
    quantityUsed: string;
    accountId: string;
    unitUsed: PackageUnit
  }[]
}
