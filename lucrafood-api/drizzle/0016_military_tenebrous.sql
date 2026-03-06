CREATE TYPE "public"."alert_type" AS ENUM('INGREDIENT_PRICE_INCREASE', 'PRODUCT_UNPROFITABLE', 'MARGIN_BELOW_TARGET');--> statement-breakpoint
CREATE TABLE "alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"type" "alert_type" NOT NULL,
	"message" text NOT NULL,
	"metadata" text,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;