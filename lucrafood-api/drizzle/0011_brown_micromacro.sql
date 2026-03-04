ALTER TABLE "ingredient_purchases" DROP CONSTRAINT "ingredient_purchases_account_id_ingredients_id_fk";
--> statement-breakpoint
ALTER TABLE "product_recipe_items" DROP CONSTRAINT "product_recipe_items_account_id_ingredients_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "totalSale" numeric DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "ingredient_purchases" ADD CONSTRAINT "ingredient_purchases_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_recipe_items" ADD CONSTRAINT "product_recipe_items_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;