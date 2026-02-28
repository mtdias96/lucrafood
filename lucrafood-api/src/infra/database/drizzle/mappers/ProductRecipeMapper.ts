
import { ProductRecipe } from '@application/entities/ProductRecipe';
import { productRecipeItems } from '../schemas/productRecipeItems';

export class ProductRecipeMapper {
  static toRows(entities: ProductRecipe[]): (typeof productRecipeItems.$inferInsert)[] {
    return entities.map((e) => ({
      id: e.id,
      ingredientId: e.ingredientId,
      accountId: e.accountId,
      productId: e.productId,
      quantityUsed: e.quantityUsed.toString(),
      unitUsed: e.unitUsed,
    }));
  }

  static toEntity(row: typeof productRecipeItems.$inferSelect): ProductRecipe {
    return new ProductRecipe({
      id: row.id,
      ingredientId: row.ingredientId,
      productId: row.productId,
      accountId: row.accountId,
      quantityUsed: Number(row.quantityUsed),
      unitUsed: row.unitUsed,
    });
  }
}
