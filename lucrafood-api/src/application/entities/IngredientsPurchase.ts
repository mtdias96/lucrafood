
import { PackageUnit } from '@shared/types/PackageUnit';
import { randomUUID } from 'node:crypto';

export class IngredientPurchase {
  readonly id: string;
  readonly ingredientId: string;
  readonly accountId: string;
  readonly storeId?: string | null | undefined;

  readonly packageQty: number;
  readonly packageUnit: PackageUnit;

  readonly totalPrice: number;
  readonly unitPrice: number;

  readonly purchasedAt: Date;

  constructor(attrs: IngredientPurchase.Attributes) {
    this.id = attrs.id ?? randomUUID();

    this.ingredientId = attrs.ingredientId;
    this.accountId = attrs.accountId;
    this.storeId = attrs.storeId;

    this.packageQty = attrs.packageQty;
    this.packageUnit = attrs.packageUnit;

    this.totalPrice = attrs.totalPrice;
    this.unitPrice = attrs.unitPrice;

    this.purchasedAt = attrs.purchasedAt ?? new Date();
  }
}

export namespace IngredientPurchase {
  export type Attributes = {
    id?: string;

    ingredientId: string;
    accountId: string;
    storeId?: string | null;

    packageQty: number;
    packageUnit: PackageUnit;

    totalPrice: number;
    unitPrice: number;

    purchasedAt?: Date;
  };
}
