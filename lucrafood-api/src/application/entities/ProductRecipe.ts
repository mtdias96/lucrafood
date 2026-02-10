import { PackageUnit } from '@shared/types/PackageUnit';
import { randomUUID } from 'node:crypto';

export class ProductRecipe {
  readonly id: string;
  readonly accountId: string;
  readonly productId: string;
  readonly ingredientId: string;

  readonly quantityUsed: number;
  readonly unitUsed: PackageUnit;

  readonly createdAt: Date;

  constructor(attrs: Ingredient.Attributes) {
    this.id = attrs.id ?? randomUUID().toString();
    this.accountId = attrs.accountId;
    this.productId = attrs.productId;
    this.ingredientId = attrs.ingredientId;

    this.quantityUsed = attrs.quantityUsed;
    this.unitUsed = attrs.unitUsed;

    this.createdAt = attrs.createdAt ?? new Date();

  }
}
export namespace Ingredient {
  export type Attributes = {
    id?: string
    accountId: string;
    ingredientId: string;
    productId: string;

    quantityUsed: number
    unitUsed: PackageUnit
    createdAt?: Date;
  };

}
