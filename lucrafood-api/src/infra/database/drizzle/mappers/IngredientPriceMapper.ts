
import { IngredientPurchase } from '@application/entities/IngredientsPurchase';
import { ingredientPurchases } from '../schemas';

export class IngredientPriceMapper {
  static toRow(entity: IngredientPurchase): typeof ingredientPurchases.$inferInsert {
    return {
      id: entity.id,
      ingredientId: entity.ingredientId,
      storeId: entity.storeId ? entity.storeId.toString() : null,

      totalPrice: entity.totalPrice.toString(),
      packageQty: entity.packageQty.toString(),
      packageUnit: entity.packageUnit,
      unitPrice: entity.unitPrice.toString(),

      purchasedAt: entity.purchasedAt,
    };
  }

  static toEntity(row: typeof ingredientPurchases.$inferSelect): IngredientPurchase {
    return new IngredientPurchase({
      id: row.id,
      ingredientId: row.ingredientId,
      storeId: row.storeId ?? null,

      totalPrice: Number(row.totalPrice),
      packageQty: Number(row.packageQty),
      packageUnit: row.packageUnit,
      unitPrice: Number(row.unitPrice),

      purchasedAt: row.purchasedAt,
    });
  }
}
