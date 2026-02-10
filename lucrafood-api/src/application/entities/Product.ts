import { PackageUnit } from '@shared/types/PackageUnit';
import { randomUUID } from 'node:crypto';

export class Product {
  readonly id: string;
  readonly accountId: string;

  readonly name: string;
  readonly yieldQty: number;
  readonly yieldUnit: PackageUnit;

  readonly createdAt: Date;

  constructor(attrs: Ingredient.Attributes) {
    this.id = attrs.id ?? randomUUID().toString();
    this.accountId = attrs.accountId;

    this.name = attrs.name;
    this.yieldQty = attrs.yieldQty;
    this.yieldUnit = attrs.yieldUnit;

    this.createdAt = attrs.createdAt ?? new Date();

  }
}
export namespace Ingredient {
  export type Attributes = {
    id?: string
    accountId: string;
    name: string;
    yieldQty: number
    yieldUnit: PackageUnit
    createdAt?: Date;
  };

}
