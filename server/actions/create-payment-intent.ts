'use server'

import process from 'node:process'
import { PaymentSchema } from '@/types/payment-schema'
import { createSafeActionClient } from 'next-safe-action'
import Stripe from 'stripe'
import { auth } from '../auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const action = createSafeActionClient()

export const createPaymentIntent = action.schema(PaymentSchema).action(async ({ parsedInput: { amount, cart, currency } }) => {
  const user = await auth()
  if (!user)
    return { error: 'You must be logged in to create a payment intent' }
  if (!amount || !cart || !currency)
    return { error: 'Missing required fields' }

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      cart: JSON.stringify(cart),
    },
  })
  return { success: {
    paymentIntentID: paymentIntent.id,
    clientSecretID: paymentIntent.client_secret,
    user: user.user.email,
  } }
})
