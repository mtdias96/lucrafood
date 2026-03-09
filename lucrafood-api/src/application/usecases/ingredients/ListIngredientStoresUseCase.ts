
import { IngredientStoreRepository } from '@infra/database/drizzle/repository/ingredients/IngredientStoreRepository';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class ListIngredientStoresUseCase {
  constructor(
    private readonly ingredientStoreRepository: IngredientStoreRepository,
  ) { };

  async execute(input: ListIngredientStoresUseCase.Input): Promise<ListIngredientStoresUseCase.Output> {
    const { accountId } = input;
    const stores = await this.ingredientStoreRepository.findAll({ accountId });

    return {
      stores: stores.map((store) => ({
        id: store.id,
        name: store.name,
        createdAt: store.createdAt,
      })),
    };
  }
}

export namespace ListIngredientStoresUseCase {
  export type Input = {
    accountId: string
  }

  export type Output = {
    stores: {
      id: string,
      name: string,
      createdAt: Date
    }[]
  }
}
