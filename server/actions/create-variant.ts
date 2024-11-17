'use server';

import { VariantSchema } from '@/types/variant-schema';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '..';
import { productVariants, variantsImages, variantsTags } from '../schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const action = createSafeActionClient();
export const createVariant = action
  .schema(VariantSchema)
  .action(
    async ({
      parsedInput: { color, productID, productType, tags, variantImages: newImages, editMode, id },
    }) => {
      try {
        if (editMode) {
          const editVariant = await db
            .update(productVariants)
            .set({ color, productType, updated: new Date() })
            .where(eq(productVariants.id, id as number))
            .returning();
          await db.delete(variantsTags).where(eq(variantsTags.variantID, editVariant[0].id));
          await db
            .insert(variantsTags)
            .values(tags.map(tag => ({ tag, variantID: editVariant[0].id })));
          await db.delete(variantsImages).where(eq(variantsImages.variantID, editVariant[0].id));
          await db.insert(variantsImages).values(
            newImages.map((img, idx) => ({
              name: img.name as string,
              size: img.size,
              url: img.url,
              variantID: editVariant[0].id,
              order: idx,
            })),
          );
          revalidatePath('/dashboard/products');
          return { success: `Variant ${editVariant[0].id} has been updated` };
        }
        if (!editMode) {
          const newVariant = await db
            .insert(productVariants)
            .values({
              color,
              productID,
              productType,
            })
            .returning();
          await db
            .insert(variantsTags)
            .values(tags.map(tag => ({ tag, variantID: newVariant[0].id })));
          await db.insert(variantsImages).values(
            newImages.map((img, idx) => ({
              name: img.name as string,
              size: img.size,
              url: img.url,
              variantID: newVariant[0].id,
              order: idx,
            })),
          );
          revalidatePath('/dashboard/products');
          return { success: `Variant ${newVariant[0].id} has been created` };
        }
      } catch (error) {
        console.error(`Error from create-variant.ts: ${error}`);
        return { error: 'An error occurred while creating the variant. Please try again later.' };
      }
    },
  );
