'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { useGetWishlistQuery } from '@/store/api/wishlistApi'
import { useSession } from 'next-auth/react'
import PrimaryButton from '@/components/ui/buttons/PrimaryButton'
import { useWishlist } from '@/context/WishlistContext'
import ItemCard from '@/components/item/ItemCard'

export default function WishlistDrawer() {
  const router = useRouter()
  const pathname = usePathname()
  const { isOpen, setIsOpen } = useWishlist()
  const { data: session } = useSession()
  const isLoggedIn = Boolean(session?.user)
  const loginHref = `/login?callback=${encodeURIComponent(pathname || '/wishlist')}`
  
  const { data: wishlist = [], isLoading, error } = useGetWishlistQuery(undefined, {
    skip: !isLoggedIn,
  })

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
            className="fixed right-0 top-0 bottom-0 z-[60] flex w-full max-w-md flex-col bg-white dark:bg-gray-800 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 p-5">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Wishlist</h2>
                {wishlist.length > 0 && (
                  <span className="rounded-full bg-sky-500 px-2 py-0.5 text-xs font-bold text-white">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 cursor-pointer text-slate-600 dark:text-gray-300"
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
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 dark:text-gray-500">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">Sign in to view wishlist</p>
                    <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Please sign in to see your saved items</p>
                  </div>
                  <PrimaryButton onClick={() => router.push(loginHref)} className="!px-6 !py-2.5 !text-sm">
                    Sign In
                  </PrimaryButton>
                </div>
              ) : isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-200 border-t-sky-500" />
                </div>
              ) : error ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-red-600 dark:text-red-400">Failed to load wishlist</p>
                    <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Please try again later</p>
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
                    <p className="font-semibold text-gray-800 dark:text-gray-200">Your wishlist is empty</p>
                    <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">Start adding items you love</p>
                  </div>
                  <PrimaryButton onClick={() => {
                    setIsOpen(false)
                    router.push('/wishlist')
                  }} className="!px-6 !py-2.5 !text-sm">
                    View All
                  </PrimaryButton>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <AnimatePresence>
                    {wishlist.map((item) => (
                      <motion.div
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ItemCard
                          product={{
                            id: item.productId,
                            name: item.name,
                            price: item.price,
                            priceMember: item.priceMember,
                            priceDp: item.priceDp,
                            priceSrp: item.priceSrp,
                            originalPrice: item.originalPrice,
                            sku: item.sku,
                            prodpv: item.prodpv,
                            image: item.image,
                          }}
                          brandName={item.brand ?? ''}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {wishlist.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-700 p-5">
                <PrimaryButton
                  onClick={() => {
                    setIsOpen(false)
                    router.push('/wishlist')
                  }}
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
