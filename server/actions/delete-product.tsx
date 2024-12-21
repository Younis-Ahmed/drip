'use server'

import { eq } from 'drizzle-orm'
import { createSafeActionClient } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '..'
import { products } from '../schema'

const action = createSafeActionClient()
export const deleteProduct = action
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const data = await db.delete(products).where(eq(products.id, id)).returning()
      revalidatePath('/dashboard/products')
      return { success: `Product ${data[0].title} deleted successfully` }
    }
    catch (e) {
      return { error: `Falied to delete product\nerror: ${e}` }
    }
  })
