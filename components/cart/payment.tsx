'use client'

import { useCartStore } from '@/lib/client-store'
import getStripe from '@/lib/get-stripe'
import { Elements } from '@stripe/react-stripe-js'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import PaymentForm from './payment-form'

const stripe = getStripe()

export default function Payment() {
  const { cart } = useCartStore()
  const { theme } = useTheme()

  const total = cart.reduce((acc, item) => acc + item.price * item.variant.quantity, 0)

  return (
    <motion.div className="max-w-2xl mx-auto">
      <Elements
        stripe={stripe}
        options={{
          locale: 'en',
          mode: 'payment',
          currency: 'usd',
          amount: total * 100,
          appearance: { theme: theme === 'dark' ? 'night' : 'flat' },
        }}
      >
        <PaymentForm totalPrice={total} />
      </Elements>
    </motion.div>
  )
}
