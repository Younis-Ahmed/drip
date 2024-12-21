'use server'
import { ProductSchema } from '@/types/product-schema'
import { eq } from 'drizzle-orm'
import { createSafeActionClient } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { db } from '..'
import { products } from '../schema'

const action = createSafeActionClient()

export const createProduct = action
  .schema(ProductSchema)
  .action(async ({ parsedInput: { description, price, title, id } }) => {
    try {
      // If id is present, we are in edit mode
      if (id) {
        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        })
        if (!currentProduct) {
          return { error: 'Product not found' }
        }
        const editedProduct = await db
          .update(products)
          .set({
            description,
            price,
            title,
          })
          .where(eq(products.id, id))
          .returning()
        revalidatePath('/dashboard/products')
        return { success: `Product ${editedProduct[0].title} has been updated` }
      }
      if (!id) {
        const newProduct = await db
          .insert(products)
          .values({
            description,
            price,
            title,
          })
          .returning()
        revalidatePath('/dashboard/products')
        return { success: `Product ${newProduct[0].title} has been created` }
      }
    }
    catch (error) {
      return { error: `Error from create-product.ts: ${error}` }
    }
  })
