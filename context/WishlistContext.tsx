'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface WishlistContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <WishlistContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
