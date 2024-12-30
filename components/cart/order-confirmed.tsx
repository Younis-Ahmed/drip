'use client'

import { useCartStore } from '@/lib/client-store'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import Link from 'next/link'
import confirmed from '../../assets/confirmed.json'
import { Button } from '../ui/button'

export default function OrderConfirmed() {
  const { setCheckoutProgress } = useCartStore()
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-medium">Thank you for your purchase!</h2>
      <Link href="/dashboard/orders">
        <Button onClick={() => {
          setCheckoutProgress('cart-page')
        }}
        >
          View your order
        </Button>
      </Link>
      <motion.div animate={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0 }} transition={{ delay: 0.35 }} className="w-full">
        <Lottie className="h-48 my-4" animationData={confirmed} />

      </motion.div>
    </div>
  )
}
