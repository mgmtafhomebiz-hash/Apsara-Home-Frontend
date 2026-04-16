'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useMemo, useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import TopBar from '@/components/layout/TopBar'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/landing-page/Footer'
import ItemCard from '@/components/item/ItemCard'
import { useGetPublicProductsQuery } from '@/store/api/productsApi'
import { useGetCategoriesQuery } from '@/store/api/categoriesApi'
import TopFilter from '@/components/item/TopFilter'
import ProductFilter, { FilterState } from '@/components/item/ProductFilter'
import type { Product } from '@/store/api/productsApi'

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// List View Product Component
function SearchListViewProduct({ product, toSlug }: { product: Product; toSlug: (value: string) => string }) {
  const srpPrice = Number(product.priceSrp ?? product.priceDp ?? 0)
  const memberPrice = Number(product.priceMember ?? product.priceDp ?? 0)
  const hasMemberPrice = memberPrice > 0 && memberPrice < srpPrice
  const displayPrice = hasMemberPrice ? memberPrice : srpPrice
  const strikePrice = hasMemberPrice ? srpPrice : Number(product.originalPrice ?? 0)
  const displayPv = Number(product.prodpv ?? 0)
  const { data: session } = useSession()
  const isLoggedIn = Boolean(session?.user)

  return (
    <Link
      href={`/product/${toSlug(product.name)}-i${product.id}`}
      className="flex gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-orange-500 dark:hover:border-orange-400 transition-colors group relative"
    >
      {/* Discount Badge */}
      {hasMemberPrice && (
        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 z-10">
          {isLoggedIn ? `Enjoy ${Math.round(((srpPrice - memberPrice) / srpPrice) * 100)}% off` : `Register to get ${Math.round(((srpPrice - memberPrice) / srpPrice) * 100)}% discount`}
        </div>
      )}

      {/* Action Icons */}
      <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            // Add to wishlist functionality here
          }}
          className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-600 shadow-lg hover:bg-orange-500 hover:border-orange-500 dark:hover:bg-orange-500 dark:hover:border-orange-500 transition-all duration-200 cursor-pointer"
          title="Add to Wishlist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-700 dark:text-gray-300 hover:text-white transition-colors">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            const productUrl = `${window.location.origin}/product/${toSlug(product.name)}-i${product.id}`
            navigator.clipboard.writeText(productUrl).then(() => {
              // Show success message
            }).catch(() => {
              // Show error message
            })
          }}
          className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-600 shadow-lg hover:bg-orange-500 hover:border-orange-500 dark:hover:bg-orange-500 dark:hover:border-orange-500 transition-all duration-200 cursor-pointer"
          title="Share"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-700 dark:text-gray-300 hover:text-white transition-colors">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </div>

      <div className="relative aspect-square w-32 bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
      </div>

      <div className="flex flex-col justify-center flex-1 p-4 relative">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">{product.name}</h3>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-lg font-bold text-orange-500 dark:text-orange-400">
            ₱{displayPrice.toLocaleString()}
          </span>
          {strikePrice > displayPrice && (
            <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
              ₱{strikePrice.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {displayPv > 0 && (
            <span className="inline-flex items-center rounded-full border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
              PV {displayPv.toLocaleString()}
            </span>
          )}
        </div>
        {/* Sales/Ratings */}
        <div className="flex items-center gap-1 mt-1">
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
        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            // Add to cart functionality here
          }}
          className="absolute bottom-4 right-4 flex items-center justify-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 px-4 py-2 text-sm font-semibold text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Add to Cart
        </button>
      </div>
    </Link>
  )
}

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const listingTopRef = useRef<HTMLDivElement | null>(null)

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showCount, setShowCount] = useState(16)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterState, setFilterState] = useState<FilterState>({
    priceRange: [0, 10000],
    sortBy: 'default',
    inStock: false,
    discountOnly: false,
    minDiscount: 0,
    pvRange: [0, 5000],
    search: '',
    hasPvOnly: false
  })

  // Fetch categories for filter
  const { data: categoriesData } = useGetCategoriesQuery({ page: 1, per_page: 100, used_only: true })

  // Fetch products using API search parameter (same as search modal)
  const debouncedQuery = query.trim()
  const { data: productsData, isLoading } = useGetPublicProductsQuery(
    {
      page: 1,
      perPage: 100,
      search: debouncedQuery,
      status: '1'
    },
    {
      skip: !debouncedQuery || debouncedQuery.length < 2
    }
  )

  // Filter products based on search query and filter state
  const filteredProducts = useMemo(() => {
    if (!debouncedQuery.trim() || !productsData?.products) return []

    const searchTerm = debouncedQuery.toLowerCase().trim()
    const searchWords = searchTerm.split(/\s+/).filter(Boolean)

    let results = (productsData.products || []).filter(product => {
      const productName = (product.name || '').toLowerCase()
      const productBrand = (product.brand || '').toLowerCase()

      // Match if any search word is found in the product name or brand
      return searchWords.some(word =>
        productName.includes(word) || productBrand.includes(word)
      )
    })

    // Apply price range filter
    if (filterState.priceRange[0] > 0 || filterState.priceRange[1] < 10000) {
      results = results.filter(product => {
        const price = product.priceSrp ?? product.priceDp ?? 0
        return price >= filterState.priceRange[0] && price <= filterState.priceRange[1]
      })
    }

    // Apply PV range filter
    if (filterState.pvRange[0] > 0 || filterState.pvRange[1] < 5000) {
      results = results.filter(product => {
        const pv = Number(product.prodpv ?? 0)
        return pv >= filterState.pvRange[0] && pv <= filterState.pvRange[1]
      })
    }

    // Filter by has PV only
    if (filterState.hasPvOnly) {
      results = results.filter(product => {
        const pv = Number(product.prodpv ?? 0)
        return pv > 0
      })
    }

    // Filter by stock
    if (filterState.inStock) {
      results = results.filter(product => (product.qty ?? 0) > 0)
    }

    // Filter by discount
    if (filterState.discountOnly) {
      results = results.filter(product => {
        const srpPrice = Number(product.priceSrp ?? product.priceDp ?? 0)
        const memberPrice = Number(product.priceMember ?? product.priceDp ?? 0)
        const hasDiscount = memberPrice > 0 && memberPrice < srpPrice

        if (filterState.minDiscount > 0 && hasDiscount) {
          const discountPercentage = Math.round(((srpPrice - memberPrice) / srpPrice) * 100)
          return discountPercentage >= filterState.minDiscount
        }

        return hasDiscount
      })
    }

    return results
  }, [debouncedQuery, productsData?.products, filterState])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / showCount))
  const boundedCurrentPage = Math.min(currentPage, totalPages)
  const paginatedProducts = filteredProducts.slice(
    (boundedCurrentPage - 1) * showCount,
    boundedCurrentPage * showCount
  )

  useEffect(() => {
    if (boundedCurrentPage <= 1) return
    listingTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [boundedCurrentPage])

  return (
    <>
      <div 
        className="fixed inset-0 -z-50 search-background"
        style={{ 
          backgroundColor: '#faf8f5',
          background: '#faf8f5'
        } as React.CSSProperties}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          html.dark .search-background {
            background-color: #030712 !important;
            background: #030712 !important;
          }
        `
      }} />
      <div className="relative min-h-screen text-slate-900 dark:text-white flex flex-col">
      <TopBar />
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Search Results
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {isLoading ? (
                'Searching...'
              ) : filteredProducts.length === 0 ? (
                <>No results found for "<span className="font-semibold">{query}</span>"</>
              ) : (
                <>Found <span className="font-semibold">{filteredProducts.length}</span> result{filteredProducts.length !== 1 ? 's' : ''} for "<span className="font-semibold">{query}</span>"</>
              )}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-semibold mb-1">No products found</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">Try searching with different keywords or adjusting filters</p>
              <Link href="/" className="text-orange-500 hover:text-orange-600 font-semibold">
                Back to home
              </Link>
            </div>
          ) : (
            <div className="flex gap-6 items-start">
              {/* Left Sidebar - Filter */}
              <aside className="hidden lg:block w-80 shrink-0 sticky top-4">
                <ProductFilter
                  onFilterChange={setFilterState}
                  pvRange={filterState.pvRange}
                  search={filterState.search}
                  categories={categoriesData?.categories || []}
                />
              </aside>

              {/* Right Side - Products */}
              <div className="flex-1 min-w-0">
                {/* Top Filter */}
                <div ref={listingTopRef} className="mb-6">
                  <TopFilter
                    onSearchChange={() => {}}
                    onViewTypeChange={setViewMode}
                    onShowNumberChange={(num) => setShowCount(num === 'all' ? filteredProducts.length : num)}
                    onSortChange={() => {}}
                    searchValue=""
                    viewType={viewMode}
                    showNumber={showCount}
                    sortValue="default"
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      Showing <span className="font-semibold text-gray-900 dark:text-white">{paginatedProducts.length}</span> of{' '}
                      <span className="font-semibold text-gray-900 dark:text-white">{filteredProducts.length}</span> products
                    </span>
                  </div>
                </div>

                {/* Products Grid/List */}
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'
                    : 'flex flex-col gap-3'
                }>
                  {paginatedProducts.map((product) => (
                    <div key={product.id}>
                      {viewMode === 'grid' ? (
                        <ItemCard product={product} brandName={product.brand || ''} />
                      ) : (
                        <SearchListViewProduct product={product} toSlug={toSlug} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-orange-500 text-white'
                            : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
    </>
  )
} 
