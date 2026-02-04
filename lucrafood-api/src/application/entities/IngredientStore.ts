import { randomUUID } from 'node:crypto';

export class IngredientStore {
  readonly id: string;
  readonly name: string;
  readonly createdAt: Date;
  ingredientId: string;

  constructor(attrs: Ingredient.Attributes) {
    this.id = attrs.id ?? randomUUID().toString();
    this.ingredientId = attrs.ingredientId;
    this.name = attrs.name;
    this.createdAt = attrs.createdAt ?? new Date();

  }
}
export namespace Ingredient {
  export type Attributes = {
    id?: string
    ingredientId: string;
    name: string;
    createdAt?: Date;
  };

}
