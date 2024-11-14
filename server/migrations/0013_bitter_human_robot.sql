ALTER TABLE "product_variants" RENAME TO "productVariants";--> statement-breakpoint
ALTER TABLE "variants_images" RENAME TO "variantsImages";--> statement-breakpoint
ALTER TABLE "variants_tags" RENAME TO "variantsTags";--> statement-breakpoint
ALTER TABLE "productVariants" DROP CONSTRAINT "product_variants_productID_products_id_fk";
--> statement-breakpoint
ALTER TABLE "variantsImages" DROP CONSTRAINT "variants_images_variantID_product_variants_id_fk";
--> statement-breakpoint
ALTER TABLE "variantsTags" DROP CONSTRAINT "variants_tags_variantID_product_variants_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "productVariants" ADD CONSTRAINT "productVariants_productID_products_id_fk" FOREIGN KEY ("productID") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variantsImages" ADD CONSTRAINT "variantsImages_variantID_productVariants_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variantsTags" ADD CONSTRAINT "variantsTags_variantID_productVariants_id_fk" FOREIGN KEY ("variantID") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
