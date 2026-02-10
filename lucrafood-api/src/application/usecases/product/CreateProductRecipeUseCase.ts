
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
    const { accountId, ingredientId, productId, quantityUsed, unitUsed } = input;

    const productAlreadyExists = await this.productRecipeRepository.findById({ accountId, productId });

    if (productAlreadyExists) { throw new Conflict('Product is already exists'); }

    const product = new ProductRecipe({ accountId, ingredientId, productId, quantityUsed, unitUsed });

    const created = await this.productRecipeRepository.create(product);

    return {
      productRecipe: {
        id: created.id,
        productId: created.productId,
        ingredientId: created.ingredientId,
        quantityUsed: created.quantityUsed,
        unitUsed: created.unitUsed,
        createdAt: created.createdAt,
      },
    };
  }
}

export namespace CreateProductRecipeUseCase {
  export type Input = {
    accountId: string;
    ingredientId: string;
    productId: string;

    quantityUsed: number
    unitUsed: PackageUnit
    createdAt?: Date;
  }

  export type Output = {
    productRecipe: {
      id: string,
      ingredientId: string;
      productId: string;

      quantityUsed: number
      unitUsed: PackageUnit
      createdAt: Date;
    }
  }
}
