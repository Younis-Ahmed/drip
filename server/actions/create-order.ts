'use server'

import { orderSchema } from '@/types/order-schema'
import { createSafeActionClient } from 'next-safe-action'

const action = createSafeActionClient()

export const createOrder = action
  .schema(orderSchema)
  .action(async ({ parsedInput }) => {})
