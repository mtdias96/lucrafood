
import { Ingredient } from '@application/entities/Ingredient';
import { Conflict } from '@application/errors/http/Conflict';

import { IngredientRepository } from '@infra/database/drizzle/repository/ingredients/IngredientRepository';

import { Injectable } from '@kernel/decorators/Injactable';
import { PackageUnit } from '@shared/types/PackageUnit';

@Injectable()
export class CreateIngredientUseCase {
  constructor(
    private readonly ingredientRepository: IngredientRepository,

  ) { };

  async execute(input: CreateIngredientUseCase.Input): Promise<CreateIngredientUseCase.Output> {
    const { name, baseUnit, accountId } = input;
    const ingredientAlreadyExists = await this.ingredientRepository.findByName({ name, accountId });

    if (ingredientAlreadyExists) { throw new Conflict('Product is already exists'); }

    const ingredient = new Ingredient({ name, baseUnit, accountId });
    const created = await this.ingredientRepository.create(ingredient);

    return {
      ingredient: {
        id: created.id,
        name: created.name,
        baseUnit: created.baseUnit,
        createdAt: created.createdAt,
      },
    };
  }
}

export namespace CreateIngredientUseCase {
  export type Input = {
    accountId: string;
    name: string;
    baseUnit: PackageUnit;
  }

  export type Output = {
    ingredient: {
      id: string,
      name: string,
      baseUnit: PackageUnit,
      createdAt: Date
    }
  }
}
