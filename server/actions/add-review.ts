'use server'

import { reviewsSchema } from '@/types/reviews-schema'
import { and, eq } from 'drizzle-orm'
import { createSafeActionClient } from 'next-safe-action'
import { revalidatePath } from 'next/cache'
import { db } from '..'
import { auth } from '../auth'
import { reviews } from '../schema'

const action = createSafeActionClient()
export const addReview = action
  .schema(reviewsSchema)
  .action(async ({ parsedInput: { productID, rating, comment } }) => {
    try {
      const session = await auth()
      if (!session)
        return { error: 'You must be logged in to leave a review' }

      const reviewExists = await db.query.reviews.findFirst({
        where: and(eq(reviews.productID, productID), eq(reviews.userID, session.user.id)),
      })

      if (reviewExists) {
        return { error: 'You have already left a review for this product' }
      }
      const newReview = await db
        .insert(reviews)
        .values({
          productID,
          rating,
          comment,
          userID: session.user.id,
        })
        .returning()
      revalidatePath(`/products/${productID}`)
      return { success: `Review for product ${newReview[0].productID} has been created` }
    }
    catch (error) {
      return { error: `Error from add-review.ts: ${JSON.stringify(error)}` }
    }
  })
