'use client'

import Image from 'next/image'
import Link from 'next/link'

export interface ItemCardProps {
  id: number
  name: string
  image?: string | null
  priceMember?: number | null
  priceDp?: number | null
  priceSrp?: number | null
  sku?: string | null
  brandName?: string | null
  /** Override the link destination */
  href?: string
  /** Optional label badge (e.g. "NEW", "HOT") shown when there is no discount */
  badge?: string | null
  /** Number of units sold — shown in the footer when provided */
  sold?: number | null
}

const toSlug = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const formatPeso = (value: number) =>
  `₱${Number(value || 0).toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`

export default function ItemCard({
  id,
  name,
  image,
  priceMember,
  priceDp,
  priceSrp,
  sku,
  brandName,
  href,
  badge,
  sold,
}: ItemCardProps) {
  const slug = toSlug(name)
  const productHref = href ?? `/product/${slug}-i${id}`

  const memberPrice = Number(priceMember ?? 0)
  const srpPrice = Number(priceSrp ?? priceDp ?? 0)
  const displayPrice = memberPrice > 0 ? memberPrice : srpPrice
  const hasDiscount = srpPrice > 0 && memberPrice > 0 && memberPrice < srpPrice
  const discountPct = hasDiscount ? Math.round((1 - memberPrice / srpPrice) * 100) : 0

  const soldLabel =
    sold != null && sold > 0
      ? sold >= 1000
        ? `${(sold / 1000).toFixed(1)}k sold`
        : `${sold} sold`
      : null

  return (
    <Link
      href={productHref}
      className="group block overflow-hidden rounded-sm bg-white shadow-sm transition-shadow duration-200 hover:shadow-lg"
    >
      {/* ── Image ── */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-medium text-gray-300">
            No Image
          </div>
        )}

        {/* Discount badge — top-left, same style as Shopee */}
        {discountPct > 0 ? (
          <div className="absolute left-0 top-0 rounded-br-md bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
            -{discountPct}%
          </div>
        ) : badge ? (
          <div className="absolute left-0 top-0 rounded-br-md bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
            {badge}
          </div>
        ) : null}
      </div>

      {/* ── Body ── */}
      <div className="space-y-1.5 px-2 pb-3 pt-2">
        {/* Product name — 2-line clamp */}
        <p className="line-clamp-2 min-h-[2.5rem] text-sm leading-snug text-gray-800">{name}</p>

        {/* Price row */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold text-orange-500">{formatPeso(displayPrice)}</span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">{formatPeso(srpPrice)}</span>
          )}
        </div>

        {/* Footer: brand left · sold/sku right */}
        <div className="flex items-center gap-1 pt-0.5">
          {brandName && (
            <span className="min-w-0 flex-1 truncate text-[11px] text-gray-400">{brandName}</span>
          )}
          {soldLabel ? (
            <span className="shrink-0 text-[11px] text-gray-400">{soldLabel}</span>
          ) : sku ? (
            <span className="shrink-0 max-w-[45%] truncate text-[11px] text-gray-400">{sku}</span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}
