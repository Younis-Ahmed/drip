'use client'

import { useCardStore } from '@/lib/client-store'
import { ShoppingBag } from 'lucide-react'

export default function CartDrawer() {
  const { cart } = useCardStore()

  return (
    <div>
      <ShoppingBag />
    </div>
  )
}
