
import { IngredientStore } from '@application/entities/IngredientStore';
import { Conflict } from '@application/errors/http/Conflict';
import { IngredientStoreRepository } from '@infra/database/drizzle/repository/ingredients/IngredientStoreRepository';

import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class CreateIngredientStoreUseCase {
  constructor(
    private readonly ingredientStoreRepository: IngredientStoreRepository,

  ) { };

  async execute(input: CreateIngredientStoreUseCase.Input): Promise<CreateIngredientStoreUseCase.Output> {
    const { name, accountId } = input;
    const storeAlreadyExists = await this.ingredientStoreRepository.findByName({ name, accountId });

    if (storeAlreadyExists) { throw new Conflict('Store is already exists'); }

    const ingredientStore = new IngredientStore({ name, accountId });

    const created = await this.ingredientStoreRepository.create(ingredientStore);

    return {
      store: {
        id: created.id,
        name: created.name,
        createdAt: created.createdAt,
      },
    };
  }
}

export namespace CreateIngredientStoreUseCase {
  export type Input = {
    name: string;
    accountId: string
  }

  export type Output = {
    store: {
      id: string,
      name: string,
      createdAt: Date
    }
  }
}
