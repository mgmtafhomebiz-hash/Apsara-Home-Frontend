'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useGetWishlistQuery, useRemoveWishlistMutation } from '@/store/api/wishlistApi'
import { useSession } from 'next-auth/react'
import { useEffect, useMemo } from 'react'
import PrimaryButton from '@/components/ui/buttons/PrimaryButton'
import { useWishlist } from '@/context/WishlistContext'

export default function WishlistDrawer() {
  const router = useRouter()
  const { isOpen, setIsOpen } = useWishlist()
  const { data: session } = useSession()
  const isLoggedIn = Boolean(session?.user)
  const [removeWishlist, { isLoading: isRemoving }] = useRemoveWishlistMutation()
  
  const { data: wishlist = [], isLoading, error } = useGetWishlistQuery(undefined, {
    skip: !isLoggedIn,
  })

  const handleRemove = async (productId: number) => {
    try {
      await removeWishlist(productId).unwrap()
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }

  const handleProductClick = (productPath: string) => {
    setIsOpen(false)
    router.push(productPath)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[60] flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-900">My Wishlist</h2>
                {wishlist.length > 0 && (
                  <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-2 transition-colors hover:bg-gray-100 active:bg-gray-200 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {!isLoggedIn ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Sign in to view wishlist</p>
                    <p className="mt-1 text-sm text-gray-400">Please sign in to see your saved items</p>
                  </div>
                  <PrimaryButton onClick={() => router.push('/login')} className="!px-6 !py-2.5 !text-sm">
                    Sign In
                  </PrimaryButton>
                </div>
              ) : isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-200 border-t-orange-500" />
                </div>
              ) : error ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-red-600">Failed to load wishlist</p>
                    <p className="mt-1 text-sm text-gray-400">Please try again later</p>
                  </div>
                </div>
              ) : wishlist.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Your wishlist is empty</p>
                    <p className="mt-1 text-sm text-gray-400">Start adding items you love</p>
                  </div>
                  <PrimaryButton onClick={() => setIsOpen(false)} className="!px-6 !py-2.5 !text-sm">
                    View All
                  </PrimaryButton>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {wishlist.map((item) => (
                      <motion.div
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 60 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3 rounded-2xl bg-gray-50 p-3"
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                          {item.image ? (
                            <Image 
                              src={item.image} 
                              alt={item.name} 
                              fill 
                              className="object-cover cursor-pointer"
                              onClick={() => handleProductClick(`/product/${item.slug}-i${item.productId}`)}
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                                <path d="M21 8v13H3V8" />
                                <path d="M1 3h22v5H1z" />
                                <path d="M10 12h4" />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <button
                            onClick={() => handleProductClick(`/product/${item.slug}-i${item.productId}`)}
                            className="truncate text-sm font-semibold text-gray-800 hover:text-orange-500 transition-colors text-left w-full"
                          >
                            {item.name}
                          </button>
                          <div className="mt-0.5 flex flex-wrap items-center gap-2">
                            <p className="text-sm font-bold text-orange-500">
                              {'\u20B1'}{Number(item.price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                              PV {Math.floor(Number(item.price) * 0.35).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <PrimaryButton
                              onClick={() => handleProductClick(`/product/${item.slug}-i${item.productId}`)}
                              className="!px-3 !py-1.5 !text-xs"
                            >
                              Add to Cart
                            </PrimaryButton>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => handleRemove(item.productId)}
                            disabled={isRemoving}
                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 cursor-pointer disabled:opacity-50"
                            title="Remove from wishlist"
                          >
                            {isRemoving ? (
                              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6" />
                                <path d="M14 11v6" />
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                              </svg>
                            )}
                          </button>
                          <p className="text-sm font-bold text-slate-900">
                            {'\u20B1'}{Number(item.price).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {wishlist.length > 0 && (
              <div className="border-t border-gray-100 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Value:</span>
                  <span className="text-lg font-bold text-orange-500">
                    {'\u20B1'}{wishlist.reduce((total, item) => total + Number(item.price), 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <PrimaryButton 
                  onClick={() => setIsOpen(false)} 
                  className="w-full !px-6 !py-2.5 !text-sm"
                >
                  View All
                </PrimaryButton>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
