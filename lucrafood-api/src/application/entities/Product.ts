import { InvalidSalePriceError } from '@application/errors/domain/InvalidSalePriceError';
import { PackageUnit } from '@shared/types/PackageUnit';
import { randomUUID } from 'node:crypto';

export class Product {
  readonly id: string;
  readonly accountId: string;

  readonly name: string;
  readonly yieldQty: number;
  readonly yieldUnit: PackageUnit;
  readonly salePrice: number;
  readonly targetMargin: number | null;

  readonly createdAt: Date;

  constructor(attrs: Product.Attributes) {
    this.id = attrs.id ?? randomUUID();
    this.accountId = attrs.accountId;

    this.name = attrs.name;
    this.yieldQty = attrs.yieldQty;
    this.yieldUnit = attrs.yieldUnit;
    this.salePrice = this.verifySalePriceIsValid(attrs.salePrice);
    this.targetMargin = attrs.targetMargin ?? null;

    this.createdAt = attrs.createdAt ?? new Date();
  }

  private verifySalePriceIsValid(salePrice: number): number {
    if (salePrice <= 0) {
      throw new InvalidSalePriceError();
    }

    return salePrice;
  }
}

export namespace Product {
  export type Attributes = {
    id?: string;
    accountId: string;
    name: string;
    yieldQty: number;
    yieldUnit: PackageUnit;
    salePrice: number;
    targetMargin?: number | null;
    createdAt?: Date;
  };
}
