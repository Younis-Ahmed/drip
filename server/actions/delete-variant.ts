'use server';

import { createSafeActionClient } from 'next-safe-action';
import * as z from 'zod';
import { db } from '..';
import { productVariants } from '../schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const action = createSafeActionClient();

export const deleteVariant = action
  .schema(
    z.object({
      id: z.number(),
    }),
  )
  .action(async ({ parsedInput: { id } }) => {
    try {
      const deletedVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();

      revalidatePath('/dashboard/products');
      return { success: `Variant ${deletedVariant[0].id} deleted successfully` };
    } catch (error) {
      return { error: `Error while trying to delete error: ${error}` };
    }
  });
