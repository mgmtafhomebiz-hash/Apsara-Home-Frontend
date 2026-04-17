'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, MessageSquareText, Star, X } from 'lucide-react'
import {
  Product,
  ProductReview,
  useGetProductsQuery,
  useGetProductReviewsQuery,
  useLazyGetProductsQuery,
} from '@/store/api/productsApi'

const clampRating = (value: number) => Math.max(0, Math.min(5, value))
const formatRating = (value: number) => clampRating(value).toFixed(2)
const dedupeProducts = (items: Product[]) =>
  Array.from(
    items.reduce((map, product) => {
      map.set(product.id, product)
      return map
    }, new Map<number, Product>()).values(),
  )

const withTimeout = async <T,>(promise: Promise<T>, ms: number): Promise<T> => {
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutHandle = setTimeout(() => reject(new Error('Request timed out.')), ms)
    })
    return await Promise.race([promise, timeoutPromise])
  } finally {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle)
    }
  }
}

const formatDate = (value?: string | null) => {
  if (!value) return 'Unknown date'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  const safeRating = clampRating(rating)
  const filled = Math.floor(safeRating)
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= filled ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}
        />
      ))}
    </div>
  )
}

export default function ProductsReviewsPageMain() {
  const [triggerGetProducts] = useLazyGetProductsQuery()
  const {
    data: firstPageData,
    isLoading: isFirstPageLoading,
    isFetching: isFirstPageFetching,
    error: firstPageError,
  } = useGetProductsQuery(
    { page: 1, perPage: 100, status: '1' },
    { refetchOnMountOrArgChange: true },
  )
  const [products, setProducts] = useState<Product[]>([])
  const [isHydratingPages, setIsHydratingPages] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const triggerGetProductsRef = useRef(triggerGetProducts)
  const rowRefs = useRef<Record<number, HTMLDivElement | null>>({ 5: null, 4: null, 3: null, 2: null, 1: null })

  useEffect(() => {
    triggerGetProductsRef.current = triggerGetProducts
  }, [triggerGetProducts])

  useEffect(() => {
    if (firstPageError) {
      setLoadError('Failed to load products with ratings. Please refresh and try again.')
      return
    }

    setLoadError(null)
  }, [firstPageError])

  useEffect(() => {
    let isActive = true

    const hydrateRemainingPages = async () => {
      if (!firstPageData) return

      const firstProducts = firstPageData.products ?? []
      if (isActive) {
        setProducts(dedupeProducts(firstProducts))
      }

      const lastPage = Math.max(1, Number(firstPageData.meta?.last_page ?? 1))
      if (lastPage <= 1) return

      setIsHydratingPages(true)
      try {
        const perPage = 100
        const pages: number[] = []
        for (let page = 2; page <= lastPage; page += 1) pages.push(page)

        const chunkSize = 4
        let aggregated = [...firstProducts]
        for (let index = 0; index < pages.length; index += chunkSize) {
          const chunk = pages.slice(index, index + chunkSize)
          const settled = await Promise.allSettled(
            chunk.map((page) =>
              withTimeout(
                triggerGetProductsRef.current({ page, perPage, status: '1' }, false).unwrap(),
                30000,
              ),
            ),
          )

          for (const result of settled) {
            if (result.status === 'fulfilled') {
              aggregated.push(...(result.value.products ?? []))
            } else {
              console.error(result.reason)
            }
          }

          if (isActive) {
            setProducts(dedupeProducts(aggregated))
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        if (isActive) {
          setIsHydratingPages(false)
        }
      }
    }

    void hydrateRemainingPages()

    return () => {
      isActive = false
    }
  }, [firstPageData])

  const groupedByStars = useMemo(() => {
    const groups: Record<number, Product[]> = { 5: [], 4: [], 3: [], 2: [], 1: [] }

    for (const product of products) {
      const rating = clampRating(Number(product.avgRating ?? 0))
      if (rating <= 0) continue
      const bucket = Math.max(1, Math.min(5, Math.round(rating)))
      groups[bucket].push(product)
    }

    for (const bucket of [5, 4, 3, 2, 1]) {
      groups[bucket].sort((a, b) => Number(b.avgRating ?? 0) - Number(a.avgRating ?? 0))
    }

    return groups
  }, [products])

  const ratingsOrder = [5, 4, 3, 2, 1] as const
  const hasRatedProducts = ratingsOrder.some((stars) => groupedByStars[stars].length > 0)
  const isLoadingProducts = (isFirstPageLoading || isFirstPageFetching || isHydratingPages) && products.length === 0

  const {
    data: selectedReviewsData,
    isFetching: isFetchingReviews,
  } = useGetProductReviewsQuery(selectedProduct?.id ?? 0, { skip: !selectedProduct })

  const selectedReviews = selectedReviewsData?.reviews ?? []
  const selectedSummary = selectedReviewsData?.summary
  const selectedReviewCount = selectedSummary?.count ?? selectedReviews.length
  const selectedBreakdown = useMemo(() => {
    const base: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

    if (selectedSummary?.breakdown) {
      for (const star of [5, 4, 3, 2, 1]) {
        const direct = Number(selectedSummary.breakdown[star] ?? 0)
        const asString = Number((selectedSummary.breakdown as Record<string, number>)[String(star)] ?? 0)
        base[star] = Math.max(0, Number.isFinite(direct) ? direct : asString)
      }
      return base
    }

    for (const review of selectedReviews) {
      const rating = Math.max(1, Math.min(5, Math.round(Number(review.rating ?? 0))))
      base[rating] += 1
    }

    return base
  }, [selectedSummary, selectedReviews])

  const scrollRow = (stars: number, direction: 'left' | 'right') => {
    const row = rowRefs.current[stars]
    if (!row) return
    row.scrollBy({ left: direction === 'left' ? -420 : 420, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Product Reviews</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Browse products grouped by star ratings. Click a product card to view all submitted reviews.
        </p>
      </div>

      {isLoadingProducts ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          Loading product ratings...
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700 shadow-sm dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {loadError}
        </div>
      ) : !hasRatedProducts ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          No products have ratings yet.
        </div>
      ) : (
        <div className="space-y-4">
          {ratingsOrder.map((stars) => {
            const items = groupedByStars[stars]
            if (items.length === 0) return null

            return (
              <section
                key={stars}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Stars rating={stars} />
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{stars} stars</p>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {items.length} products
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => scrollRow(stars, 'left')}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      aria-label={`Scroll ${stars}-star row left`}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollRow(stars, 'right')}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      aria-label={`Scroll ${stars}-star row right`}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div
                  ref={(node) => {
                    rowRefs.current[stars] = node
                  }}
                  className="flex snap-x gap-3 overflow-x-auto pb-2"
                >
                  {items.map((product) => {
                    const image = product.image || '/af_home_logo.png'
                    const avgRating = clampRating(Number(product.avgRating ?? 0))
                    return (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => setSelectedProduct(product)}
                        className="w-44 shrink-0 snap-start rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-orange-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-orange-500"
                      >
                        <div className="relative mb-3 h-24 w-full overflow-hidden rounded-lg bg-white dark:bg-slate-900">
                          <Image src={image} alt={product.name} fill className="object-cover" unoptimized />
                        </div>
                        <p className="line-clamp-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{product.name}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <Stars rating={avgRating} size={12} />
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{formatRating(avgRating)}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )}

      {selectedProduct ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-start justify-between border-b border-slate-200 p-5 dark:border-slate-800">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Product Reviews</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{selectedProduct.name}</h2>
                <div className="mt-2 flex items-center gap-2">
                  <Stars rating={Number(selectedProduct.avgRating ?? 0)} />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {formatRating(Number(selectedProduct.avgRating ?? 0))}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Close reviews modal"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[68vh] overflow-y-auto p-5">
              {isFetchingReviews ? (
                <p className="text-sm text-slate-600 dark:text-slate-300">Loading reviews...</p>
              ) : selectedSummary ? (
                <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Average rating</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedSummary.average.toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{selectedReviewCount} review(s)</p>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = selectedBreakdown[star] ?? 0
                      const pct = selectedReviewCount > 0 ? (count / selectedReviewCount) * 100 : 0
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="w-10 text-xs font-medium text-slate-600 dark:text-slate-300">{star}★</span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                            <div
                              className="h-full rounded-full bg-amber-400"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-12 text-right text-xs text-slate-600 dark:text-slate-300">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : null}

              {selectedReviews.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/60">
                  <MessageSquareText className="mx-auto mb-2 text-slate-400 dark:text-slate-500" size={22} />
                  <p className="text-sm text-slate-600 dark:text-slate-300">No written reviews yet for this product.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedReviews.map((review: ProductReview) => (
                    <article
                      key={review.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{review.customer_name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(review.created_at)}</p>
                      </div>
                      <div className="mt-1">
                        <Stars rating={review.rating} size={13} />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                        {review.review?.trim() ? review.review : 'No comment provided.'}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
