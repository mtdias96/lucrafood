
import { StockRepository } from '@infra/database/drizzle/repository/stock/StockRepository';
import { Injectable } from '@kernel/decorators/Injactable';
import { PackageUnit } from '@shared/types/PackageUnit';

@Injectable()
export class ListStockUseCase {
  constructor(
    private readonly stockRepository: StockRepository,
  ) { }

  async execute(input: ListStockUseCase.Input): Promise<ListStockUseCase.Output> {
    const { accountId } = input;

    const [ingredientRows, productRows] = await Promise.all([
      this.stockRepository.findAllIngredientStock(accountId),
      this.stockRepository.findAllProductStock(accountId),
    ]);

    const ingredients = ingredientRows.map(row => {
      const currentQty = Number(row.currentQty);
      const minQty = Number(row.minQty);

      return {
        ingredientId: row.ingredientId,
        ingredientName: row.ingredientName,
        currentQty,
        minQty,
        unit: row.unit,
        lowStock: currentQty < minQty,
        updatedAt: row.updatedAt,
      };
    });

    const products = productRows.map(row => {
      const currentQty = Number(row.currentQty);
      const minQty = Number(row.minQty);

      return {
        productId: row.productId,
        productName: row.productName,
        currentQty,
        minQty,
        unit: row.unit,
        lowStock: currentQty < minQty,
        updatedAt: row.updatedAt,
      };
    });

    return { ingredients, products };
  }
}

export namespace ListStockUseCase {
  export type Input = {
    accountId: string;
  };

  export type StockItem = {
    currentQty: number;
    minQty: number;
    unit: PackageUnit;
    lowStock: boolean;
    updatedAt: Date;
  };

  export type Output = {
    ingredients: Array<StockItem & { ingredientId: string; ingredientName: string }>;
    products: Array<StockItem & { productId: string; productName: string }>;
  };
}
