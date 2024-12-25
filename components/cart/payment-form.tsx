'use client'

import { log } from 'node:console'
import { useCartStore } from '@/lib/client-store'
import { createPaymentIntent } from '@/server/actions/create-payment-intent'
import { AddressElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useState } from 'react'
import { Button } from '../ui/button'

interface PaymentIntentResult {
  error?: string
  success?: {
    paymentIntentID: string
    clientSecretID: string
    user: string
  }
}
export default function PaymentForm({ totalPrice }: { totalPrice: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const { cart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (!stripe || !elements) {
      setLoading(false)
      return
    }
    const { error: submitError } = await elements?.submit()
    if (submitError) {
      setErrorMessage(submitError.message!)
      setLoading(false)
      return
    }

    const data = await createPaymentIntent({
      amount: totalPrice,
      currency: 'usd',
      cart: cart.map(item => ({
        quantity: item.variant.quantity,
        productID: item.id,
        title: item.name,
        price: item.price,
        image: item.image,
      })),
    }) as PaymentIntentResult

    if (data?.error) {
      setErrorMessage(data.error)
      setLoading(false)
      return
    }

    if (data?.success) {
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: data?.success.clientSecretID,
        redirect: 'if_required',
        confirmParams: {
          return_url: 'http://localhost:3000/success',
          receipt_email: data.success.user,
        },
      })
      if (error) {
        setErrorMessage(error.message!)
        setLoading(false)
      }
      else {
        setLoading(false)
        log('save the order')
      }
    }
  }

  return (
    <form action="" onSubmit={handleSubmit}>
      <PaymentElement />
      <AddressElement options={{
        mode: 'shipping',
      }}
      />
      <Button disabled={!stripe || !elements}>
        <span>Pay now</span>
      </Button>
    </form>

  )
}
