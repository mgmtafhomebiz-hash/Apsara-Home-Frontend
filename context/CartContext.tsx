'use client'

import { ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  setCartOpen,
  toggleCartItemSelected as toggleCartItemSelectedAction,
  setCartSelection as setCartSelectionAction,
} from '@/store/slices/cartSlice'

export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number | null
  image: string
  quantity: number
  prodpv?: number | null
  brand?: string | null
  selectedColor?: string | null
  selectedSize?: string | null
  selectedType?: string | null
  selectedSku?: string | null
}

interface CartContextType {
  items: CartItem[]
  selectedIds: string[]
  selectedItems: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  toggleItemSelected: (id: string) => void
  setSelection: (ids: string[]) => void
  selectAll: () => void
  clearSelection: () => void
  cartCount: number
  total: number
  selectedCount: number
  selectedTotal: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

// Backward-compatible wrapper: existing tree can keep <CartProvider>.
export function CartProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function useCart(): CartContextType {
  const dispatch = useAppDispatch()
  const { items, isOpen, selectedIds } = useAppSelector((state) => state.cart)

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    dispatch(addToCartAction(item))
  }

  const removeFromCart = (id: string) => {
    dispatch(removeFromCartAction(id))
  }

  const updateQuantity = (id: string, qty: number) => {
    dispatch(updateQuantityAction({ id, quantity: qty }))
  }

  const setIsOpen = (open: boolean) => {
    dispatch(setCartOpen(open))
  }

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const selectedItems = items.filter((item) => selectedIds.includes(item.id))
  const selectedCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0)
  const selectedTotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const toggleItemSelected = (id: string) => {
    dispatch(toggleCartItemSelectedAction(id))
  }

  const selectAll = () => {
    dispatch(setCartSelectionAction({ ids: items.map((item) => item.id) }))
  }

  const clearSelection = () => {
    dispatch(setCartSelectionAction({ ids: [] }))
  }

  const setSelection = (ids: string[]) => {
    dispatch(setCartSelectionAction({ ids }))
  }

  return {
    items,
    selectedIds,
    selectedItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleItemSelected,
    setSelection,
    selectAll,
    clearSelection,
    cartCount,
    total,
    selectedCount,
    selectedTotal,
    isOpen,
    setIsOpen,
  }
}
