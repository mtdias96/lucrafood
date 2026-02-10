
import { ProductRecipe } from '@application/entities/ProductRecipe';
import { productRecipeItems } from '../schemas/productRecipeItems';

export class ProductRecipeMapper {
  static toRow(entity: ProductRecipe): typeof productRecipeItems.$inferInsert {
    return {
      id: entity.id,
      ingredientId: entity.ingredientId,
      accountId: entity.accountId,
      productId: entity.productId,
      quantityUsed: entity.quantityUsed.toString(),
      unitUsed: entity.unitUsed,

    };
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
