ALTER TABLE "stores" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "stores" CASCADE;--> statement-breakpoint
ALTER TABLE "ingredient_prices" DROP CONSTRAINT "ingredient_prices_store_id_stores_id_fk";
--> statement-breakpoint
ALTER TABLE "ingredient_prices" ADD CONSTRAINT "ingredient_prices_store_id_ingredientStores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."ingredientStores"("id") ON DELETE restrict ON UPDATE no action;