import { randomUUID } from 'node:crypto';

export class IngredientStore {
  readonly id: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly accountId: string;

  constructor(attrs: Ingredient.Attributes) {
    this.id = attrs.id ?? randomUUID().toString();
    this.accountId = attrs.accountId;
    this.name = attrs.name;
    this.createdAt = attrs.createdAt ?? new Date();

  }
}
export namespace Ingredient {
  export type Attributes = {
    id?: string
    accountId: string;
    name: string;
    createdAt?: Date;
  };

}
