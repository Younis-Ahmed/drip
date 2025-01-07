'use server'

import { orderSchema } from '@/types/order-schema'
import { createSafeActionClient } from 'next-safe-action'
import { db } from '..'
import { auth } from '../auth'
import { orderProduct, orders } from '../schema'

const action = createSafeActionClient()

export const createOrder = action
  .schema(orderSchema)
  .action(async ({ parsedInput: { products, status, total, paymentIntentId } }) => {
    const user = await auth()
    if (!user)
      return { error: 'You must be logged in to create an order' }

    const order = await db.insert(orders).values({
      status,
      total,
      paymentIntentId,
      userID: user.user.id,
    }).returning()

    const orderProducts = products.map(async ({ productID, quantity, variantID }) => {
      const NewOrderProducts = await db.insert(orderProduct).values({
        quantity,
        orderID: order[0].id,
        productID,
        productVariantsID: variantID,
      })
    })
    return { success: `Order ${order[0].id} has been created` }
  })
