
import { ProductRecipe } from '@application/entities/ProductRecipe';
import { Conflict } from '@application/errors/http/Conflict';
import { ProductRecipeRepository } from '@infra/database/drizzle/repository/products/productRecipeRepository';

import { Injectable } from '@kernel/decorators/Injactable';
import { PackageUnit } from '@shared/types/PackageUnit';

@Injectable()
export class CreateProductRecipeUseCase {
  constructor(
    private readonly productRecipeRepository: ProductRecipeRepository,

  ) { };

  async execute(input: CreateProductRecipeUseCase.Input): Promise<CreateProductRecipeUseCase.Output> {
    const { accountId, productId, productRecipe } = input;

    const alreadyExists = await this.productRecipeRepository.findById({ accountId, productId });

    if (alreadyExists) { throw new Conflict('Product recipe already exists'); }

    const entities = productRecipe.map(
      ({ ingredientId, quantityUsed, unitUsed }) =>
        new ProductRecipe({ accountId, ingredientId, productId, quantityUsed, unitUsed }),
    );

    const created = await this.productRecipeRepository.create(entities);

    return {
      productRecipe: created.map((item) => ({
        id: item.id,
        productId: item.productId,
        ingredientId: item.ingredientId,
        quantityUsed: item.quantityUsed,
        unitUsed: item.unitUsed,
        createdAt: item.createdAt,
      })),
    };
  }
}

export namespace CreateProductRecipeUseCase {
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
    productRecipe: {
      id: string,
      ingredientId: string;
      productId: string;

      quantityUsed: number
      unitUsed: PackageUnit
      createdAt: Date;
    }[]
  }
}
