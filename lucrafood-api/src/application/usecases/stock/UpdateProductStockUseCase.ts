
import { NotFound } from '@application/errors/http/NotFound';
import { ProductRepository } from '@infra/database/drizzle/repository/products/productRepository';
import { StockRepository } from '@infra/database/drizzle/repository/stock/StockRepository';
import { Injectable } from '@kernel/decorators/Injactable';
import { PackageUnit } from '@shared/types/PackageUnit';

@Injectable()
export class UpdateProductStockUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly stockRepository: StockRepository,
  ) { }

  async execute(input: UpdateProductStockUseCase.Input): Promise<UpdateProductStockUseCase.Output> {
    const { accountId, productId, currentQty, minQty, unit } = input;

    const product = await this.productRepository.findById({ productId, accountId });

    if (!product) {
      throw new NotFound('Product not found');
    }

    const row = await this.stockRepository.upsertProductStock({
      productId,
      accountId,
      currentQty,
      minQty: minQty ?? 0,
      unit,
    });

    const qty = Number(row.currentQty);
    const min = Number(row.minQty);

    return {
      productId: row.productId,
      currentQty: qty,
      minQty: min,
      unit: row.unit,
      lowStock: qty < min,
    };
  }
}

export namespace UpdateProductStockUseCase {
  export type Input = {
    accountId: string;
    productId: string;
    currentQty: number;
    minQty?: number;
    unit: PackageUnit;
  };

  export type Output = {
    productId: string;
    currentQty: number;
    minQty: number;
    unit: PackageUnit;
    lowStock: boolean;
  };
}
