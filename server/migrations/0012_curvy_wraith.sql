CREATE TABLE IF NOT EXISTS "variants_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"size" real NOT NULL,
	"name" text NOT NULL,
	"order" real NOT NULL,
	"variantID" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "variants_tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag" text NOT NULL,
	"variantID" serial NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_variants" DROP CONSTRAINT "product_variants_variantID_product_variants_id_fk";
--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "color" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "productType" text NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "updated" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "product_variants" ADD COLUMN "productID" serial NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variants_images" ADD CONSTRAINT "variants_images_variantID_product_variants_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variants_tags" ADD CONSTRAINT "variants_tags_variantID_product_variants_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productID_products_id_fk" FOREIGN KEY ("productID") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "product_variants" DROP COLUMN IF EXISTS "tag";--> statement-breakpoint
ALTER TABLE "product_variants" DROP COLUMN IF EXISTS "variantID";