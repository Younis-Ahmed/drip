'use server';

import { createSafeActionClient } from 'next-safe-action';
import * as z from 'zod';
import { db } from '..';
import { productVariants } from '../schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { algoliasearch } from 'algoliasearch';

const action = createSafeActionClient();

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID as string,
  process.env.ALGOLIA_SECRET_KEY as string,
);

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
      await client.deleteObject({
        indexName: 'products',
        objectID: id.toString(),
      });
      return { success: `Variant ${deletedVariant[0].id} deleted successfully` };
    } catch (error) {
      return { error: `Error while trying to delete error: ${error}` };
    }
  });
