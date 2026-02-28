
import { Injectable } from '@kernel/decorators/Injactable';
import { and, count, eq, inArray, ne } from 'drizzle-orm';

import { Product } from '@application/entities/Product';
import { DbError } from '@application/errors/db/DbError';
import { PackageUnit } from '@shared/types/PackageUnit';
import { DrizzleClient } from '../../Client';
import { ProductMapper } from '../../mappers/ProductMapper';
import { ingredientPurchases, ingredients, productRecipeItems, products } from '../../schemas';

@Injectable()
export class ProductRepository {
  constructor(private readonly db: DrizzleClient) { }

  async create(input: Product): Promise<Product> {
    const row = ProductMapper.toRow(input);

    const [created] = await this.db.client
      .insert(products)
      .values(row)
      .returning();

    if (!created) {
      throw new DbError('DB_INSERT_FAILED: Product returned no row');
    }

    return ProductMapper.toDomain(created);
  }

  async findByName(input: { name: string, accountId: string }): Promise<Product | null> {
    const [row] = await this.db.client
      .select()
      .from(products)
      .where(and(
        eq(products.name, input.name),
        eq(products.accountId, input.accountId),
      ))
      .limit(1);

  if (!row) {return null;}
  return ProductMapper.toDomain(row);
  }

  async findById(input: { productId: string, accountId: string }): Promise<Product | null> {
    const [row] = await this.db.client
      .select()
      .from(products)
      .where(and(
        eq(products.id, input.productId),
        eq(products.accountId, input.accountId),
      ))
      .limit(1);

      if (!row) {return null;}
  return ProductMapper.toDomain(row);
  }

  async findPageWithRecipeByAccount(input: { accountId: string, offset: number, limit: number }): Promise<ProductRepository.ProductWithItemsAndIngredients> {
    const product = await this.db.client
      .select()
      .from(products)
      .where(
        eq(products.accountId, input.accountId))
      .offset(input.offset)
      .limit(input.limit);

    const productIds = product.map(product => product.id);

    if (productIds.length === 0) {
      return [];
    }

    const productItem = await this.db.client
      .select()
      .from(productRecipeItems).where(and(
        eq(productRecipeItems.accountId, input.accountId),
        inArray(productRecipeItems.productId, productIds),
      ));

    if (productItem.length === 0) { return []; }

    const itemsByProductId = new Map<string, typeof productItem>();

    for (const item of productItem) {
      const current = itemsByProductId.get(item.productId) ?? [];
      current.push(item);
      itemsByProductId.set(item.productId, current);
    }

    const ingredientIds = [...new Set(productItem.map(i => i.ingredientId))];

    if (ingredientIds.length === 0) { return []; }

    const ingredientsRows = await this.db.client
      .select()
      .from(ingredients)
      .where(and(
        eq(ingredients.accountId, input.accountId),
        inArray(ingredients.id, ingredientIds),
      ));

    const ingredientId = ingredientsRows.map(ingredient => ingredient.id);
    const ingredientById = new Map<string, typeof ingredientsRows[number]>();

    for (const item of ingredientsRows) {
      ingredientById.set(item.id, item);
    }

    console.log('ingredientId (input):', ingredientId);
    const ingredientPrice = await this.db.client
      .select()
      .from(ingredientPurchases)
      .where(and(
        eq(ingredientPurchases.accountId, input.accountId),
        inArray(ingredientPurchases.ingredientId, ingredientId),
      ));

      console.log({ ingredientPrice, ingredientId });

    const productWithItemsAndIngredients: ProductRepository.ProductWithItemsAndIngredients =
      product.map(p => {
        const items = itemsByProductId.get(p.id) ?? [];

        return {
          id: p.id,
          name: p.name,
          yieldQty: p.yieldQty,
          yieldUnit: p.yieldUnit,
          salePrice: p.salePrice,
          createdAt: p.createdAt,
          items: items.map(item => ({
            ingredientId: item.ingredientId,
            ingredientName: ingredientById.get(item.ingredientId)?.name ?? null,
            quantity: item.quantityUsed,
            unit: item.unitUsed,
          })),
        };
      });

    return productWithItemsAndIngredients;
  }

  async countByAccount(accountId: string): Promise<number> {
    const result = await this.db.client
      .select({ count: count() })
      .from(products)
      .where(eq(products.accountId, accountId));

    return Number(result[0].count);
  }

  async updateSalePrice({ accountId, productId, salePrice }: ProductRepository.updateSalePrice): Promise<string> {
    const newPrice = salePrice.toFixed(2);

    const updated = await this.db.client.update(products).set(
      {
        salePrice: newPrice,
        updatedAt: new Date(),
       } ,
    )
    .where(and(
      eq(products.id, productId),
      eq(products.accountId, accountId),
      ne(products.salePrice, newPrice),
    ))
    .returning({ id: products.id })
    ;

    if(updated.length > 0) {return 'updated';}

    const [exists] = await this.db.client
    .select()
    .from(products)
    .where(and(
      eq(products.id, productId),
      eq(products.accountId, accountId),
    ))
    .limit(1);

    return exists ? 'unchanged' : 'not_found';
  }

}

export namespace ProductRepository {
  export type ProductWithItemsAndIngredients = Array<{
    id: string;
    name: string;
    yieldQty: number;
    yieldUnit: PackageUnit;
    salePrice: string,
    createdAt: Date;
    items: Array<{
      ingredientId: string;
      ingredientName: string | null;
      quantity: string;
      unit: PackageUnit;
    }>;
  }>;

  export type updateSalePrice = {
    accountId: string;
    productId: string;
    salePrice: number
  }
}
