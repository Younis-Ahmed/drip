'use server'

import process from 'process'
import { VariantSchema } from '@/types/variant-schema'
import { algoliasearch } from 'algoliasearch'
import { eq } from 'drizzle-orm'
import { createSafeActionClient } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { db } from '..'
import { products, productVariants, variantsImages, variantsTags } from '../schema'

const action = createSafeActionClient()

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID as string,
  process.env.ALGOLIA_WRITE_KEY as string,
)

// const algoliaIndex = await client.searchSingleIndex({
//   indexName: 'products',
// });
export const createVariant = action
  .schema(VariantSchema)
  .action(
    async ({
      parsedInput: { color, productID, productType, tags, variantImages: newImages, editMode, id },
    }) => {
      try {
        if (editMode && id) {
          const editVariant = await db
            .update(productVariants)
            .set({ color, productType, updated: new Date() })
            .where(eq(productVariants.id, id as number))
            .returning()
          await db.delete(variantsTags).where(eq(variantsTags.variantID, editVariant[0].id))
          await db
            .insert(variantsTags)
            .values(tags.map(tag => ({ tag, variantID: editVariant[0].id })))
          await db.delete(variantsImages).where(eq(variantsImages.variantID, editVariant[0].id))
          await db.insert(variantsImages).values(
            newImages.map((img, idx) => ({
              name: img.name as string,
              size: img.size,
              url: img.url,
              variantID: editVariant[0].id,
              order: idx,
            })),
          )
          await client.addOrUpdateObject({
            indexName: 'products',
            objectID: editVariant[0].id.toString(),
            body: {
              id: editVariant[0].productID,
              productType: editVariant[0].productType,
              variantsImages: newImages[0].url,
            },
          })
          revalidatePath('/dashboard/products')
          return { success: `Variant ${editVariant[0].id} has been updated` }
        }
        if (!editMode) {
          const product = await db.query.products.findFirst({
            where: eq(products.id, productID),
          })
          if (!product) {
            return { error: `Product with ID ${productID} does not exist` }
          }
          const newVariant = await db
            .insert(productVariants)
            .values({
              color,
              productID,
              productType,
            })
            .returning()
          await db
            .insert(variantsTags)
            .values(tags.map(tag => ({ tag, variantID: newVariant[0].id })))
          await db.insert(variantsImages).values(
            newImages.map((img, idx) => ({
              name: img.name as string,
              size: img.size,
              url: img.url,
              variantID: newVariant[0].id,
              order: idx,
            })),
          )

          if (product) {
            await client.addOrUpdateObject({
              indexName: 'products',
              objectID: newVariant[0].id.toString(),
              body: {
                id: newVariant[0].productID,
                title: product.title,
                price: product.price,
                productType: newVariant[0].productType,
                variantsImages: newImages[0].url,
              },
            })
          }

          revalidatePath('/dashboard/products')
          return { success: `Variant ${product.title} has been created` }
        }
      }
      catch (error) {
        console.error(`Error from create-variant.ts: ${error}`)
        return { error: 'An error occurred while creating the variant. Please try again later.' }
      }
    },
  )
