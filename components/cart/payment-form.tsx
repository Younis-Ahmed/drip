'use client'

import { useCartStore } from '@/lib/client-store'
import { createOrder } from '@/server/actions/create-order'
import { createPaymentIntent } from '@/server/actions/create-payment-intent'
import { AddressElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'

export default function PaymentForm({ totalPrice }: { totalPrice: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const { cart, setCheckoutProgress, clearCart, setCartOpen } = useCartStore()
  const [loading, setLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const { execute } = useAction(createOrder, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.error(data.error)
      }
      if (data?.success) {
        setLoading(false)
        toast.success(data.success)
        setCheckoutProgress('confirmation-page')
        clearCart()
      }
    },
  })

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
      amount: totalPrice * 100,
      currency: 'usd',
      cart: cart.map(item => ({
        quantity: item.variant.quantity,
        productID: item.id,
        title: item.name,
        price: item.price,
        image: item.image,
      })),
    })

    if (data?.data?.error) {
      setErrorMessage(data?.data?.error)
      setLoading(false)
      router.push('/auth/login')
      setCartOpen(false)
      return
    }

    if (data?.data?.success) {
      const clientSecretID = data.data.success.clientSecretID

      if (typeof clientSecretID === 'string' && typeof data.data.success.user === 'string') {
        const { error } = await stripe.confirmPayment({
          elements,
          clientSecret: clientSecretID,
          redirect: 'if_required',
          confirmParams: {
            return_url: 'http://localhost:3000/success',
            receipt_email: data.data.success.user,
          },
        })

        if (error) {
          setErrorMessage(error.message!)
          setLoading(false)
          // eslint-disable-next-line no-useless-return
          return
        }
        else {
          setLoading(false)
          execute({
            status: 'pending',
            total: totalPrice,
            paymentIntentId: data.data.success.paymentIntentID,
            products: cart.map(item => ({
              quantity: item.variant.quantity,
              productID: item.id,
              variantID: item.variant.variantID,
            })),
          })
        }
      }
      else {
        setErrorMessage('Invalid client secret ID')
        setLoading(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <AddressElement options={{
        mode: 'shipping',
      }}
      />
      <Button className="my-4 w-full" disabled={!stripe || !elements || loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>

  )
}
