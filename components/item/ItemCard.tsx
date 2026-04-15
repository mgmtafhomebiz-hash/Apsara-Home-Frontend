'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useAddToCartMutation, useGetCartQuery } from '@/store/api/cartApi'
import { useGetWishlistQuery, useAddWishlistMutation, useRemoveWishlistMutation } from '@/store/api/wishlistApi'
import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatPeso = (value: number) => `₱${Number(value || 0).toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`

interface Product {
  id: number
  name: string
  image?: string | null
  price?: number | null
  priceMember?: number | null
  priceDp?: number | null
  priceSrp?: number | null
  originalPrice?: number | null
  sku?: string | null
  prodpv?: number | null
}

interface ItemCardProps {
  product: Product
  brandName: string
}

export default function ItemCard({ product, brandName }: ItemCardProps) {
  const slug = toSlug(product.name)
  const href = `/product/${slug}-i${product.id}`
  const [imageError, setImageError] = useState(false)
  const { data: session } = useSession()
  const isLoggedIn = Boolean(session?.user)
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation()
  const { setIsOpen } = useCart()
  const { refetch: refetchCart } = useGetCartQuery(undefined, { skip: !isLoggedIn })
  const [isHoveringShare, setIsHoveringShare] = useState(false)
  
  const handleShareExternal = (type: 'messenger' | 'whatsapp' | 'x' | 'telegram' | 'viber') => {
    const url = `${window.location.origin}${href}`
    const title = product.name
    if (!url) return

    const encodedUrl = encodeURIComponent(url)
    const encodedText = encodeURIComponent(`${title} - ${url}`)
    const shareTargets: Record<string, string> = {
      messenger: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
      x: `https://twitter.com/intent/tweet?text=${encodedText}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      viber: `viber://forward?text=${encodedText}`,
    }
    const targetUrl = shareTargets[type]
    if (targetUrl) window.open(targetUrl, '_blank', 'noopener,noreferrer')
  }
  
  // Wishlist functionality
  const { data: wishlist = [] } = useGetWishlistQuery(undefined, { skip: !isLoggedIn })
  const [addWishlist, { isLoading: isAddingToWishlist }] = useAddWishlistMutation()
  const [removeWishlist, { isLoading: isRemovingFromWishlist }] = useRemoveWishlistMutation()
  
  const isInWishlist = wishlist.some(item => item.productId === product.id)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      toast.error('Please sign in to add items to cart')
      return
    }

    console.log('Adding to cart:', { product_id: product.id, quantity: 1 })

    try {
      const result = await addToCart({
        product_id: product.id,
        quantity: 1,
      }).unwrap()
      console.log('Add to cart result:', result)
      toast.success('Item added to cart successfully')
      setIsOpen(true)
      // Refetch cart to sync with backend
      refetchCart()
    } catch (error: any) {
      console.error('Error adding to cart - Full error object:', JSON.stringify(error, null, 2))
      console.error('Error properties:', {
        status: error?.status,
        data: error?.data,
        message: error?.message,
        error: error?.error
      })
      const errorMessage = error?.data?.message || error?.message || 'Failed to add item to cart'
      toast.error(errorMessage)
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const productUrl = `${window.location.origin}${href}`
    navigator.clipboard.writeText(productUrl).then(() => {
      toast.success('Link copied to clipboard')
    }).catch(() => {
      toast.error('Failed to copy link')
    })
  }

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      toast.error('Please sign in to add items to wishlist')
      return
    }

    try {
      if (isInWishlist) {
        await removeWishlist(product.id).unwrap()
        toast.success('Removed from wishlist')
      } else {
        await addWishlist({ 
          product_id: product.id,
          product_name: product.name 
        }).unwrap()
        toast.success('Added to wishlist')
      }
    } catch (error: any) {
      console.error('Wishlist error:', error)
      const errorMessage = error?.data?.message || error?.message || 'Failed to update wishlist'
      toast.error(errorMessage)
    }
  }

  const srpPrice = Number(product.priceSrp ?? product.price ?? 0)
  const memberPrice = Number(product.priceMember ?? product.priceDp ?? 0)
  const hasMemberPrice = memberPrice > 0 && memberPrice < srpPrice
  const displayPrice = hasMemberPrice ? memberPrice : srpPrice
  const strikePrice = hasMemberPrice ? srpPrice : Number(product.originalPrice ?? 0)
  const displayPv = Number(product.prodpv ?? 0)

  return (
    <Link href={href} className="flex flex-col group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-orange-500 dark:hover:border-orange-400 transition-colors cursor-pointer">
      {/* Product Image */}
      <div className="relative aspect-[3/4] w-full bg-gray-100 dark:bg-gray-700 overflow-hidden border-b border-gray-200 dark:border-gray-700">
        {/* Action Icons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
          <div className="relative">
            <button
            onClick={handleWishlist}
            disabled={isAddingToWishlist || isRemovingFromWishlist}
            className={`p-2 rounded-full backdrop-blur-md border shadow-lg transition-all duration-200 cursor-pointer hover:cursor-hand ${
              isInWishlist 
                ? 'bg-orange-500 border-orange-500 hover:bg-orange-600 hover:border-orange-600' 
                : 'bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-600 hover:bg-orange-500 hover:border-orange-500 dark:hover:bg-orange-500 dark:hover:border-orange-500'
            } ${isAddingToWishlist || isRemovingFromWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            {(isAddingToWishlist || isRemovingFromWishlist) ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill={isInWishlist ? "white" : "none"} 
                stroke={isInWishlist ? "white" : "currentColor"} 
                strokeWidth="2" 
                className={`transition-colors ${isInWishlist ? 'text-white' : 'text-gray-700 dark:text-gray-300 hover:text-white'}`}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            )}
          </button>
          </div>
          <button
            onClick={handleShare}
            onMouseEnter={() => setIsHoveringShare(true)}
            onMouseLeave={() => setIsHoveringShare(false)}
            className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-600 shadow-lg hover:bg-orange-500 hover:border-orange-500 dark:hover:bg-orange-500 dark:hover:border-orange-500 transition-all duration-200 cursor-pointer hover:cursor-hand"
          >
            {isHoveringShare ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-700 dark:text-gray-300 hover:text-white transition-colors">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-700 dark:text-gray-300 hover:text-white transition-colors">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            )}
          </button>
        </div>
        {product.image && !imageError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400 dark:text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}

        {/* Discount Badge */}
        {hasMemberPrice ? (
          <div className="absolute top-0 left-0 bg-orange-500 text-white text-xs font-bold px-2 py-1">
            {isLoggedIn ? `Enjoy ${Math.round(((srpPrice - memberPrice) / srpPrice) * 100)}% off` : `Register to get ${Math.round(((srpPrice - memberPrice) / srpPrice) * 100)}% discount`}
          </div>
        ) : null}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="absolute bottom-3 right-3 flex items-center justify-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 px-4 py-2 text-sm font-semibold text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:cursor-hand disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAddingToCart ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Adding...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="mt-1.5 flex flex-col gap-1 p-3">
        {/* Product Name */}
        <h3 className="line-clamp-2 text-sm text-gray-800 dark:text-gray-200 leading-snug min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-orange-500 dark:text-orange-400">
              ₱{displayPrice.toLocaleString()}
            </span>
            {strikePrice > displayPrice && (
              <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                ₱{strikePrice.toLocaleString()}
              </span>
            )}
          </div>
          {displayPv > 0 && (
            <span className="rounded-full border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-300 shrink-0">
              PV {displayPv.toLocaleString()}
            </span>
          )}
        </div>

        {/* Sales/Ratings */}
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill={star <= 4 ? '#f97316' : 'none'}
                stroke={star <= 4 ? '#f97316' : '#d1d5db'}
                strokeWidth="2"
              >
                <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">124 sold</span>
        </div>
      </div>
    </Link>
  )
}
