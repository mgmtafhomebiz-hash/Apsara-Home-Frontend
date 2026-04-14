'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

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

  const srpPrice = Number(product.priceSrp ?? product.price ?? 0)
  const memberPrice = Number(product.priceMember ?? product.priceDp ?? 0)
  const hasMemberPrice = memberPrice > 0 && memberPrice < srpPrice
  const displayPrice = hasMemberPrice ? memberPrice : srpPrice
  const strikePrice = hasMemberPrice ? srpPrice : Number(product.originalPrice ?? 0)
  const displayPv = Number(product.prodpv ?? 0)

  return (
    <Link href={href} className="flex flex-col group border border-gray-200 rounded-lg overflow-hidden hover:border-orange-500 transition-colors">
      {/* Product Image */}
      <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden border-b border-gray-200">
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
          <div className="flex h-full items-center justify-center text-gray-400">
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
        <button className="absolute bottom-3 right-3 flex items-center justify-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 px-4 py-2 text-sm font-semibold text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Add to Cart
        </button>
      </div>

      {/* Product Info */}
      <div className="mt-1.5 flex flex-col gap-1 p-3">
        {/* Product Name */}
        <h3 className="line-clamp-2 text-sm text-gray-800 leading-snug min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-orange-500">
              ₱{displayPrice.toLocaleString()}
            </span>
            {strikePrice > displayPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₱{strikePrice.toLocaleString()}
              </span>
            )}
          </div>
          {displayPv > 0 && (
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 shrink-0">
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
          <span className="text-xs text-gray-400">124 sold</span>
        </div>
      </div>
    </Link>
  )
}
