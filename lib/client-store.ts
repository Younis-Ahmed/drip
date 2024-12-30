import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Variant {
  variantID: number
  quantity: number
}

export interface CartItem {
  id: number
  name: string
  image: string
  variant: Variant
  price: number
}

export type CartProgress = 'cart-page' | 'payment-page' | 'confirmation-page'

export interface CartState {
  cart: CartItem[]
  checkoutProgress: CartProgress
  setCheckoutProgress: (val: CartProgress) => void
  addToCart: (item: CartItem) => void
  removeFromCart: (item: CartItem) => void
  clearCart: () => void
  cartOpen: boolean
  setCartOpen: (val: boolean) => void
}

export const useCartStore = create<CartState>()(persist(set => ({
  cart: [],
  clearCart: () => set({ cart: [] }),
  cartOpen: false,
  setCartOpen: val => set({ cartOpen: val }),
  checkoutProgress: 'cart-page',
  setCheckoutProgress: val => set(() => ({ checkoutProgress: val })),
  addToCart: item => set((state) => {
    const existingItem = state.cart.find(cartItem => cartItem.variant.variantID === item.variant.variantID)

    if (existingItem) {
      const updatedCart = state.cart.map((cartItem) => {
        if (cartItem.variant.variantID === item.variant.variantID) {
          return {
            ...cartItem,
            variant: {
              ...cartItem.variant,
              quantity: cartItem.variant.quantity + item.variant.quantity,
            },

          }
        }
        return cartItem
      })
      return { cart: updatedCart }
    }
    else {
      return { cart: [...state.cart, { ...item, variant: {
        variantID: item.variant.variantID,
        quantity: item.variant.quantity,
      } }] }
    }
  }),
  removeFromCart: item => set((state) => {
    const updatedCart = state.cart.map((cartItem) => {
      if (cartItem.variant.variantID === item.variant.variantID) {
        return {
          ...cartItem,
          variant: {
            ...cartItem.variant,
            quantity: cartItem.variant.quantity - 1,
          },
        }
      }
      return cartItem
    })
    return {
      cart: updatedCart.filter(item => item.variant.quantity > 0),
    }
  }),
}), { name: 'cart-storage' }),
)
