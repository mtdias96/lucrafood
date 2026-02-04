CREATE TYPE "public"."ingredient_unit" AS ENUM('g', 'ml', 'un', 'kg', 'l');--> statement-breakpoint
CREATE TABLE "ingredientStoresTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ingredient_id" uuid NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ingredients" ALTER COLUMN "unit" SET DATA TYPE "public"."ingredient_unit" USING "unit"::"public"."ingredient_unit";--> statement-breakpoint
ALTER TABLE "ingredientStoresTable" ADD CONSTRAINT "ingredientStoresTable_ingredient_id_ingredients_id_fk" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE cascade ON UPDATE no action;