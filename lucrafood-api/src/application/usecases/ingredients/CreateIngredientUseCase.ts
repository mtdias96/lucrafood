
import { Ingredient } from '@application/entities/Ingredient';
import { Conflict } from '@application/errors/http/NotFound';
import { IngredientUnit } from '@application/types/ingredientUnit';
import { IngredientRepository } from '@infra/database/drizzle/repository/ingredients/IngredientRepository';

import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class CreateIngredientUseCase {
  constructor(
    private readonly ingredientRepository: IngredientRepository,

  ) { };

  async execute(input: CreateIngredientUseCase.Input): Promise<CreateIngredientUseCase.Output> {
    const { name, unit, accountId } = input;
    const ingredientAlreadyExists = await this.ingredientRepository.findByName(name, accountId);

    if (ingredientAlreadyExists) { throw new Conflict('Product is already exists'); }

    const ingredient = new Ingredient({ name, unit, accountId });
    const created = await this.ingredientRepository.create(ingredient);

    return {
      ingredient: {
        id: created.id,
        name: created.name,
        unit: created.unit,
        createdAt: created.createdAt,
      },
    };
  }
}

export namespace CreateIngredientUseCase {
  export type Input = {
    accountId: string;
    name: string;
    unit: IngredientUnit;
  }

  export type Output = {
    ingredient: {
      id: string,
      name: string,
      unit: IngredientUnit,
      createdAt: Date
    }
  }
}
