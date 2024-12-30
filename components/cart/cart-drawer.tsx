'use client'

import { useCartStore } from '@/lib/client-store'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from '../ui/drawer'
import CartItems from './cart-items'
import CartMessage from './cart-message'
import OrderConfirmed from './order-confirmed'
import Payment from './payment'

export default function CartDrawer() {
  const { cart, checkoutProgress } = useCartStore()

  return (
    <Drawer>
      <DrawerTrigger>
        <div className="relative px-2">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0 }}
                className="absolute flex items-center justify-center -top-1 w-4 h-4 dark:bg-primary bg-primary text-white text-sm font-bold rounded-full -right-0.5"
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
          <ShoppingBag />
        </div>
      </DrawerTrigger>
      <DrawerContent className="min-h-50vh">
        <DrawerHeader>
          <CartMessage />
        </DrawerHeader>
        <div className="overflow-auto p-4">
          { checkoutProgress === 'cart-page' && <CartItems />}
          { checkoutProgress === 'payment-page' && <Payment />}
          { checkoutProgress === 'confirmation-page' && <OrderConfirmed />}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
