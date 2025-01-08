import type { Stripe } from '@stripe/stripe-js'
import process from 'process'
import { loadStripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

export default getStripe
