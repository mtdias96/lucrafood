import { PackageUnit } from '@shared/types/PackageUnit';
import { randomUUID } from 'node:crypto';

export class Ingredient {
  readonly id: string;
  readonly accountId: string;

  readonly name: string;
  baseUnit: PackageUnit;

  readonly createdAt: Date;

  constructor(attrs: Ingredient.Attributes) {
    this.id = attrs.id ?? randomUUID().toString();
    this.accountId = attrs.accountId;

    this.name = attrs.name;
    this.baseUnit = attrs.baseUnit;

    this.createdAt = attrs.createdAt ?? new Date();

  }
}
export namespace Ingredient {
  export type Attributes = {
    id?: string
    name: string;
    accountId: string;
    baseUnit: PackageUnit
    createdAt?: Date;
  };

}
