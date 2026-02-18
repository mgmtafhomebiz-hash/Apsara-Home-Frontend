'use client'

import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import CartDrawer from '@/components/ui/CartDrawer'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </AuthProvider>
  )
}
