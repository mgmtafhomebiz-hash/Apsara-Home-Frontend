'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Link2, X as XIcon } from 'lucide-react'
import toast from 'react-hot-toast'

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
  brand?: string | null
}

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
  brandName?: string
  shareUrl?: string
}

type ShareOptionWithIconSrc = {
  id: string
  label: string
  iconSrc: string
  action: () => void
  icon?: never
}

type ShareOptionWithIcon = {
  id: string
  label: string
  iconSrc?: never
  action: () => void
  icon: React.ComponentType<{ size?: number }>
}

type ShareOption = ShareOptionWithIconSrc | ShareOptionWithIcon

export default function ShareModal({ isOpen, onClose, product, brandName, shareUrl }: ShareModalProps) {
  const [shareCopied, setShareCopied] = useState(false)

  const toSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const slug = toSlug(product.name)
  const href = shareUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/product/${slug}-i${product.id}`
  const [imageError, setImageError] = useState(false)

  const baseSrp = (product.originalPrice ? Number(product.originalPrice) : undefined) ?? (product.price ? Number(product.price) : undefined) ?? 0
  const srpPrice = (product.priceSrp ? Number(product.priceSrp) : undefined) ?? baseSrp
  const memberPrice = (product.priceMember ? Number(product.priceMember) : undefined) ?? (product.priceDp ? Number(product.priceDp) : undefined) ?? 0
  const hasMemberPrice = memberPrice > 0 && memberPrice < srpPrice
  const displayPrice = hasMemberPrice ? memberPrice : srpPrice
  const displayPv = product.prodpv ? Number(product.prodpv) : 0
  const displaySku = product.sku || ''

  const handleCopyShareLink = async () => {
    if (!href) return
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(href)
      } else {
        const fallback = document.createElement('textarea')
        fallback.value = href
        fallback.style.position = 'fixed'
        fallback.style.opacity = '0'
        document.body.appendChild(fallback)
        fallback.focus()
        fallback.select()
        document.execCommand('copy')
        document.body.removeChild(fallback)
      }
      setShareCopied(true)
      toast.success('Link copied to clipboard')
      setTimeout(() => setShareCopied(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const handleShareExternal = (type: 'messenger' | 'whatsapp' | 'x' | 'telegram' | 'viber') => {
    const url = href
    const title = product.name
    if (!url) return

    const encodedUrl = encodeURIComponent(url)
    const encodedText = encodeURIComponent(`${title} - ${url}`)
    const encodedTitleOnly = encodeURIComponent(title)
    const shareTargets: Record<string, string> = {
      messenger: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
      x: `https://twitter.com/intent/tweet?text=${encodedText}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitleOnly}`,
      viber: `viber://forward?text=${encodedText}`,
    }
    const targetUrl = shareTargets[type]
    if (targetUrl) window.open(targetUrl, '_blank', 'noopener,noreferrer')
  }

  const shareOptions: ShareOption[] = [
    { id: 'messenger', label: 'Messenger', iconSrc: '/Images/icon_apps/messenger1.png', action: () => handleShareExternal('messenger') },
    { id: 'whatsapp', label: 'WhatsApp', iconSrc: '/Images/icon_apps/whatsapp1.png', action: () => handleShareExternal('whatsapp') },
    { id: 'x', label: 'X', iconSrc: '/Images/icon_apps/x1.png', action: () => handleShareExternal('x') },
    { id: 'telegram', label: 'Telegram', iconSrc: '/Images/icon_apps/telegram1.png', action: () => handleShareExternal('telegram') },
    { id: 'viber', label: 'Viber', iconSrc: '/Images/icon_apps/viber1.png', action: () => handleShareExternal('viber') },
    { id: 'copy', label: shareCopied ? 'Copied' : 'Copy link', icon: Link2, action: handleCopyShareLink },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center px-4 pb-6 sm:p-6"
          >
            <div className="relative w-full max-w-xl rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Share to</p>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-gray-200">Send this {displayPrice > 0 ? 'product' : 'brand'}</h3>
                </div>
                <button
                  onClick={onClose}
                  className="h-9 w-9 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-200 dark:hover:border-orange-900/50 transition-colors"
                  type="button"
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="mx-auto" size={16} />
                </button>
              </div>

              {/* Product Info */}
              <div className="mt-5 flex items-start gap-4 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
                {product.image && !imageError ? (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      unoptimized
                      onError={() => setImageError(true)}
                    />
                  </div>
                ) : (
                  <div className="h-20 w-20 shrink-0 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {brandName && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{brandName}</p>
                  )}
                  <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-sm">{product.name}</h4>
                  {displayPrice > 0 && (
                    <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                      <span className="text-lg font-bold text-orange-500 dark:text-orange-400">
                        ₱{displayPrice.toLocaleString()}
                      </span>
                      {hasMemberPrice && (
                        <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                          ₱{srpPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}
                  {displayPrice > 0 && displaySku && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">SKU: {displaySku}</p>
                  )}
                  {displayPrice > 0 && displayPv > 0 && (
                    <span className="inline-block mt-1 rounded-full border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-300">
                      PV {displayPv.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Social Sharing Buttons */}
              <div className="mt-5 grid grid-cols-3 sm:grid-cols-6 gap-4">
                {shareOptions.map((item) => (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="flex flex-col items-center gap-2 text-center text-xs font-semibold text-slate-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    type="button"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 dark:border-gray-600 text-slate-600 dark:text-gray-400">
                      {'iconSrc' in item ? (
                        <Image
                          src={item.iconSrc as string}
                          alt={item.label}
                          width={28}
                          height={28}
                          className="h-7 w-7 object-contain"
                        />
                      ) : (
                        <item.icon size={22} />
                      )}
                    </span>
                    <span className="leading-tight">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Share Link */}
              <div className="mt-4 rounded-2xl border border-gray-100 dark:border-gray-700 px-4 py-3">
                <p className="text-xs font-semibold text-slate-500 dark:text-gray-400">{displayPrice > 0 ? 'Product' : 'Brand'} share link</p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-600 dark:text-gray-400 truncate">{href}</span>
                  <button
                    onClick={handleCopyShareLink}
                    className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                    type="button"
                  >
                    {shareCopied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
