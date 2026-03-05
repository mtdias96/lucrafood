import { Product } from '@application/entities/Product';
import { PackageUnit } from '@shared/types/PackageUnit';

export class ProductMapper {
  static toRow(product: Product): ProductMapper.ProductRow {
    return {
      id: product.id,
      accountId: product.accountId,
      name: product.name,
      yieldQty: product.yieldQty,
      yieldUnit: product.yieldUnit,
      salePrice: product.salePrice.toString(),
      targetMargin: product.targetMargin?.toString() ?? null,
      createdAt: product.createdAt,
    };
  }

static toDomain(row: ProductMapper.ProductRow): Product {
  return new Product({
    id: row.id,
    accountId: row.accountId,
    name: row.name,
    yieldQty: row.yieldQty,
    yieldUnit: row.yieldUnit,
    salePrice: Number(row.salePrice),
    targetMargin: row.targetMargin ? Number(row.targetMargin) : null,
    createdAt: row.createdAt,
  });
}
}

export namespace ProductMapper {
  export type ProductRow = {
    id: string;
    accountId: string;
    name: string;
    yieldQty: number;
    yieldUnit: PackageUnit;
    salePrice: string;
    targetMargin: string | null;
    createdAt: Date;
  }
};
