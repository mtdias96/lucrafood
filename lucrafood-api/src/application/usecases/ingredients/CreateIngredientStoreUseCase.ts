
import { IngredientStore } from '@application/entities/IngredientStore';
import { Conflict } from '@application/errors/http/NotFound';
import { IngredientStoreRepository } from '@infra/database/drizzle/repository/ingredients/IngredientStoreRepository';

import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class CreateIngredientStoreUseCase {
  constructor(
    private readonly ingredientStoreRepository: IngredientStoreRepository,

  ) { };

  async execute(input: CreateIngredientStoreUseCase.Input): Promise<CreateIngredientStoreUseCase.Output> {
    const { name, ingredientId } = input;
    const ingredientAlreadyExists = await this.ingredientStoreRepository.findByName(name, ingredientId);

    if (ingredientAlreadyExists) { throw new Conflict('Store is already exists'); }

    const ingredientStore = new IngredientStore({ name, ingredientId });
    const created = await this.ingredientStoreRepository.create(ingredientStore);

    return {
      ingredientStore: {
        id: created.id,
        name: created.name,
        ingredientId: created.ingredientId,
        createdAt: created.createdAt,
      },
    };
  }
}

export namespace CreateIngredientStoreUseCase {
  export type Input = {
    ingredientId: string;
    name: string;
  }

  export type Output = {
    ingredientStore: {
      id: string,
      ingredientId: string;
      name: string,
      createdAt: Date
    }
  }
}
