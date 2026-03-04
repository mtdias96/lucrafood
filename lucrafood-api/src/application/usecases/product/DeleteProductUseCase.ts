import { NotFound } from '@application/errors/http/NotFound';
import { ProductRepository } from '@infra/database/drizzle/repository/products/productRepository';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) { }

  async execute(input: DeleteProductUseCase.Input): Promise<void> {
    const { accountId, productId } = input;

    const deleted = await this.productRepository.delete({ accountId, productId });

    if (deleted === 'not_found') {
      throw new NotFound('Product not found');
    }
  }
}

export namespace DeleteProductUseCase {
  export type Input = {
    accountId: string;
    productId: string;
  }
}
