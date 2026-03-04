import { NotFound } from '@application/errors/http/NotFound';
import { ProductRecipeRepository } from '@infra/database/drizzle/repository/products/productRecipeRepository';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class DeleteProductRecipeItemUseCase {
  constructor(private readonly productRecipeRepository: ProductRecipeRepository) { }

  async execute(input: DeleteProductRecipeItemUseCase.Input): Promise<void> {
    const { accountId, productId, recipeItemId } = input;

    const result = await this.productRecipeRepository.deleteItem({
      accountId,
      productId,
      recipeItemId,
    });

    if (result === 'not_found') {
      throw new NotFound('Recipe item not found');
    }
  }
}

export namespace DeleteProductRecipeItemUseCase {
  export type Input = {
    accountId: string;
    productId: string;
    recipeItemId: string;
  }
}
