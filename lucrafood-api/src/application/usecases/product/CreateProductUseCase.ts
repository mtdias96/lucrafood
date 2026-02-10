
import { Product } from '@application/entities/Product';
import { Conflict } from '@application/errors/http/Conflict';

import { ProductRepository } from '@infra/database/drizzle/repository/products/productRepository';

import { Injectable } from '@kernel/decorators/Injactable';
import { PackageUnit } from '@shared/types/PackageUnit';

@Injectable()
export class CreateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,

  ) { };

  async execute(input: CreateProductUseCase.Input): Promise<CreateProductUseCase.Output> {
    const { accountId, name, yieldQty, yieldUnit } = input;

    const productAlreadyExists = await this.productRepository.findByName({ name, accountId });

    if (productAlreadyExists) { throw new Conflict('Product is already exists'); }

    const product = new Product({ accountId, name, yieldUnit, yieldQty });

    const created = await this.productRepository.create(product);

    return {
      product: {
        id: created.id,
        name: created.name,
        yieldQty: created.yieldQty,
        yieldUnit: created.yieldUnit,
        createdAt: created.createdAt,
      },
    };
  }
}

export namespace CreateProductUseCase {
  export type Input = {
    accountId: string;
    name: string;
    yieldQty: number,
    yieldUnit: PackageUnit
  }

  export type Output = {
    product: {
      id: string,
      name: string;
      yieldQty: number,
      yieldUnit: PackageUnit
      createdAt: Date
    }
  }
}
