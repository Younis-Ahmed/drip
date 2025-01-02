import * as z from 'zod'

export const orderSchema = z.object({
  total: z.number(),
  status: z.enum(['pending', 'completed', 'cancelled']),
  paymentIntentId: z.string(),
  products: z.array(
    z.object({
      quantity: z.number(),
      productID: z.number(),
      variantID: z.number(),
    }),
  ),
})
