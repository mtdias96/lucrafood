import { IngredientUnit } from '@application/types/ingredientUnit';
import { randomUUID } from 'node:crypto';

export class Ingredient {
  readonly id: string;
  readonly name: string;
  readonly createdAt: Date;
  accountId: string;
  unit: IngredientUnit;

  constructor(attrs: Ingredient.Attributes) {
    this.id = attrs.id ?? randomUUID().toString();
    this.accountId = attrs.accountId;
    this.name = attrs.name;
    this.unit = attrs.unit;
    this.createdAt = attrs.createdAt ?? new Date();

  }
}
export namespace Ingredient {
  export type Attributes = {
    id?: string
    name: string;
    accountId: string;
    unit: IngredientUnit
    createdAt?: Date;
  };

}
