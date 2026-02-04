ALTER TABLE "ingredientStoresTable" RENAME TO "ingredientStores";--> statement-breakpoint
ALTER TABLE "ingredientStores" DROP CONSTRAINT "ingredientStoresTable_ingredient_id_ingredients_id_fk";
--> statement-breakpoint
ALTER TABLE "ingredientStores" ADD CONSTRAINT "ingredientStores_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;