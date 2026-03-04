import { NotFound } from '@application/errors/http/NotFound';
import { ProductRepository } from '@infra/database/drizzle/repository/products/productRepository';
import { Injectable } from '@kernel/decorators/Injactable';

@Injectable()
export class UpdateProductSalePriceUseCase {
  constructor(private readonly productRepository: ProductRepository) {

  }

  async execute(input: UpdateProductSalePriceUseCase.Input) {
    const { accountId, productId, salePrice } = input;

    const affectedProduct = await this.productRepository.updateSalePrice({ accountId, productId, salePrice });

    if(affectedProduct === 'not_found') {
      throw new NotFound('Product not found');
    }

    return;
  }
}

export namespace UpdateProductSalePriceUseCase {
  export type Input = {
    productId: string
    salePrice: number;
    accountId: string
  }
}
