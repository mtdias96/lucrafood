import { BadRequest } from '@application/errors/http/BadRequest';
import { Conflict } from '@application/errors/http/Conflict';
import { NotFound } from '@application/errors/http/NotFound';
import { ProductRepository } from '@infra/database/drizzle/repository/products/productRepository';
import { Injectable } from '@kernel/decorators/Injactable';
import { PackageUnit } from '@shared/types/PackageUnit';

@Injectable()
export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) { }

  async execute(input: UpdateProductUseCase.Input): Promise<UpdateProductUseCase.Output> {
    const { accountId, productId, name, yieldQty, yieldUnit, targetMargin } = input;

    const hasAtLeastOneField = name !== undefined || yieldQty !== undefined || yieldUnit !== undefined || targetMargin !== undefined;

    if (!hasAtLeastOneField) {
      throw new BadRequest('At least one field must be provided');
    }

    const product = await this.productRepository.findById({ productId, accountId });

    if (!product) {
      throw new NotFound('Product not found');
    }

    if (name && name !== product.name) {
      const existing = await this.productRepository.findByName({ name, accountId });
      if (existing) { throw new Conflict('Product name already exists'); }
    }

    const updated = await this.productRepository.update({
      accountId,
      productId,
      name,
      yieldQty,
      yieldUnit,
      targetMargin,
    });

    return {
      product: {
        id: updated.id,
        name: updated.name,
        yieldQty: updated.yieldQty,
        yieldUnit: updated.yieldUnit,
        salePrice: updated.salePrice,
        targetMargin: updated.targetMargin,
      },
    };
  }
}

export namespace UpdateProductUseCase {
  export type Input = {
    accountId: string;
    productId: string;
    name?: string;
    yieldQty?: number;
    yieldUnit?: PackageUnit;
    targetMargin?: number | null;
  }

  export type Output = {
    product: {
      id: string;
      name: string;
      yieldQty: number;
      yieldUnit: PackageUnit;
      salePrice: number;
      targetMargin: number | null;
    };
  }
}
