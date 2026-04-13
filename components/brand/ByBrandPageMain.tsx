'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useGetPublicProductBrandsQuery } from '@/store/api/productBrandsApi'
import { useGetPublicProductsQuery } from '@/store/api/productsApi'

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
const formatPeso = (value: number) => `P${Number(value || 0).toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
const getBrandInitials = (value: string) => value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('') || 'BR'

const GRADIENT_PALETTES = [
  'from-orange-400 to-rose-400',
  'from-violet-400 to-purple-500',
  'from-sky-400 to-blue-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-pink-400 to-rose-500',
  'from-indigo-400 to-violet-500',
  'from-cyan-400 to-sky-500',
]

const getBrandGradient = (name: string) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return GRADIENT_PALETTES[Math.abs(hash) % GRADIENT_PALETTES.length]
}

function BrandCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-4">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded-full bg-gray-200" />
          <div className="h-3 w-1/2 rounded-full bg-gray-100" />
        </div>
      </div>
    </div>
  )
}

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 rounded-full bg-gray-200" />
        <div className="h-4 w-full rounded-full bg-gray-200" />
        <div className="h-4 w-4/5 rounded-full bg-gray-200" />
        <div className="h-5 w-1/2 rounded-full bg-gray-200" />
      </div>
    </div>
  )
}

export default function ByBrandPageMain() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedBrand = searchParams.get('brand')?.trim().toLowerCase() ?? ''
  const [letterFilter, setLetterFilter] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const { data, isFetching } = useGetPublicProductBrandsQuery()

  const allBrands = useMemo(
    () => (data?.brands ?? []).filter((brand) => brand.status === 0 && brand.name.trim().length > 0),
    [data?.brands],
  )

  const availableLetters = useMemo(() => {
    const letters = new Set(allBrands.map((b) => b.name.charAt(0).toUpperCase()))
    return ['ALL', ...Array.from(letters).sort()]
  }, [allBrands])

  const brands = useMemo(() => {
    let rows = allBrands
    if (selectedBrand) rows = rows.filter((brand) => toSlug(brand.name) === selectedBrand)
    else {
      if (searchQuery.trim()) rows = rows.filter((b) => b.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
      else if (letterFilter !== 'ALL') rows = rows.filter((b) => b.name.charAt(0).toUpperCase() === letterFilter)
    }
    return rows
  }, [allBrands, selectedBrand, letterFilter, searchQuery])

  const [productPage, setProductPage] = useState(1)
  const PER_PAGE = 12

  const selectedBrandItem = useMemo(
    () => (data?.brands ?? []).find((brand) => toSlug(brand.name) === selectedBrand) ?? null,
    [data?.brands, selectedBrand],
  )

  // Reset to page 1 when brand changes
  const prevBrand = useRef(selectedBrand)
  if (prevBrand.current !== selectedBrand) {
    prevBrand.current = selectedBrand
    if (productPage !== 1) setProductPage(1)
  }

  const { data: brandProductsData, isFetching: isFetchingProducts } = useGetPublicProductsQuery(
    selectedBrandItem
      ? { page: productPage, perPage: PER_PAGE, status: '1', brandType: selectedBrandItem.id }
      : undefined,
    { skip: !selectedBrandItem },
  )
  const brandProducts = brandProductsData?.products ?? []
  const productsMeta = brandProductsData?.meta
  const totalPages = productsMeta?.last_page ?? 1

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-20">
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-white/20 sm:left-6 sm:top-6"
        >
          ← Back
        </button>
        <div className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #f97316 0%, transparent 50%), radial-gradient(circle at 80% 20%, #fb923c 0%, transparent 40%)' }}
        />
        <div className="relative container mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-400">Shop by Brand</p>
          <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">
            {selectedBrand && selectedBrandItem ? selectedBrandItem.name : 'All Brands'}
          </h1>
          <p className="mt-3 max-w-xl text-gray-400">
            Browse featured product brands from the catalog. Pick a brand below to continue exploring.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 space-y-8">
        {/* Search + Letter Filter — only when no brand selected */}
        {!selectedBrand && (
          <div className="flex flex-col gap-3">
            {/* Search input */}
            <div className="relative max-w-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setLetterFilter('ALL') }}
                placeholder="Search brands..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-700 placeholder:text-gray-400 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              )}
            </div>
            {/* Letter filter pills — hidden when searching */}
            {!searchQuery && (
              <div className="flex flex-wrap gap-2">
                {availableLetters.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => setLetterFilter(letter)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
                      letterFilter === letter
                        ? 'bg-orange-500 text-white shadow-sm shadow-orange-200'
                        : 'bg-white text-gray-500 ring-1 ring-gray-200 hover:ring-orange-300 hover:text-orange-500'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Brand Grid */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          {isFetching ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <BrandCardSkeleton key={i} />)}
            </div>
          ) : brands.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">🏷️</div>
              <p className="mt-4 font-semibold text-gray-700">No brands found</p>
              <p className="mt-1 text-sm text-gray-400">Try a different letter filter</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {brands.map((brand) => {
                const brandSlug = toSlug(brand.name)
                const isActive = brandSlug === selectedBrand
                const gradient = getBrandGradient(brand.name)

                return (
                  <Link
                    key={brand.id}
                    href={`/by-brand?brand=${encodeURIComponent(brandSlug)}`}
                    className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                      isActive
                        ? 'border-orange-300 bg-orange-50 shadow-sm shadow-orange-100'
                        : 'border-gray-100 bg-white hover:border-orange-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl ${brand.image ? 'bg-gray-100' : `bg-gradient-to-br ${gradient}`}`}>
                        {brand.image ? (
                          <Image src={brand.image} alt={brand.name} fill className="object-cover" unoptimized />
                        ) : (
                          <span className="text-sm font-extrabold tracking-wider text-white">
                            {getBrandInitials(brand.name)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-sm font-bold ${isActive ? 'text-orange-700' : 'text-gray-900'}`}>
                          {brand.name}
                        </p>
                        <p className={`mt-0.5 text-xs transition-colors ${isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-orange-500'}`}>
                          View brand →
                        </p>
                      </div>
                    </div>
                    {isActive && (
                      <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-orange-400" />
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Brand Products Section */}
        {selectedBrandItem && (
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex flex-col gap-2 border-b border-gray-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">Brand Products</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">{selectedBrandItem.name}</h2>
              </div>
              <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 ring-1 ring-orange-200">
                {isFetchingProducts ? 'Loading…' : `${productsMeta?.total ?? brandProducts.length} product${(productsMeta?.total ?? brandProducts.length) !== 1 ? 's' : ''}`}
              </span>
            </div>

            <div className="mt-6">
              {isFetchingProducts ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
              ) : brandProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">📦</div>
                  <p className="mt-4 font-semibold text-gray-700">No products yet</p>
                  <p className="mt-1 text-sm text-gray-400">No products assigned to this brand yet.</p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {brandProducts.map((product) => {
                    const slug = toSlug(product.name)
                    const href = `/product/${slug}-i${product.id}`

                    return (
                      <Link
                        key={product.id}
                        href={href}
                        className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
                      >
                        <div className="relative aspect-[4/3] bg-gray-50">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm font-semibold text-gray-300">
                              No Image
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                        </div>
                        <div className="space-y-2 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-500">{selectedBrandItem.name}</p>
                          <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-semibold text-gray-900 leading-snug">
                            {product.name}
                          </h3>
                          <div className="flex items-end justify-between gap-3 pt-1">
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Member Price</p>
                              <p className="text-base font-bold text-orange-600">
                                {formatPeso(product.priceMember ?? product.priceDp ?? product.priceSrp)}
                              </p>
                            </div>
                            <span className="rounded-lg bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-400 ring-1 ring-gray-100">
                              {product.sku || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Pagination */}
            {!isFetchingProducts && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
                <p className="text-sm text-gray-400">
                  Page <span className="font-semibold text-gray-700">{productPage}</span> of <span className="font-semibold text-gray-700">{totalPages}</span>
                </p>
                <div className="flex items-center gap-1.5">
                  {/* Prev */}
                  <button
                    onClick={() => setProductPage((p) => Math.max(1, p - 1))}
                    disabled={productPage === 1}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-orange-300 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - productPage) <= 1)
                    .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis')
                      acc.push(p)
                      return acc
                    }, [])
                    .map((item, idx) =>
                      item === 'ellipsis' ? (
                        <span key={`e-${idx}`} className="flex h-9 w-9 items-center justify-center text-sm text-gray-400">…</span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setProductPage(item as number)}
                          className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                            productPage === item
                              ? 'bg-orange-500 text-white shadow-sm shadow-orange-200'
                              : 'border border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-500'
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}

                  {/* Next */}
                  <button
                    onClick={() => setProductPage((p) => Math.min(totalPages, p + 1))}
                    disabled={productPage === totalPages}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-orange-300 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
