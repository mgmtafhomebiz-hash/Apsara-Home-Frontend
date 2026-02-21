'use client'

import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/ui/CartDrawer'
import { Provider as ReduxProvider } from 'react-redux'
import { SessionProvider } from 'next-auth/react'
import { store } from '@/store/store'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider> 
        <ReduxProvider store={store}>
          <CartProvider>
          {children}
          <CartDrawer />
          </CartProvider>
        </ReduxProvider>
    </SessionProvider>
  )
}
