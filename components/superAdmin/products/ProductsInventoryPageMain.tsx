'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Download, PackagePlus, Search, X } from 'lucide-react'
import { showErrorToast, showSuccessToast } from '@/libs/toast'
import { Product, useGetProductsQuery, useLazyGetProductsQuery, useUpdateProductMutation } from '@/store/api/productsApi'

type StockFilter = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock'
type StockModalMode = 'adjust' | 'restock'

const LOW_STOCK_THRESHOLD = 10
const PAGE_SIZE = 15
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

const formatNumber = (value: number) => value.toLocaleString('en-PH')
const formatDate = (value?: string | null) => {
  if (!value) return 'N/A'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}

const toQuantity = (product: Product) => {
  const qty = Number(product.qty ?? 0)
  return Number.isFinite(qty) ? Math.max(0, qty) : 0
}

const getStockStatus = (quantity: number): StockFilter => {
  if (quantity <= 0) return 'out-of-stock'
  if (quantity <= LOW_STOCK_THRESHOLD) return 'low-stock'
  return 'in-stock'
}

const stockLabel: Record<StockFilter, string> = {
  all: 'All',
  'in-stock': 'In stock',
  'low-stock': 'Low stock',
  'out-of-stock': 'Out of stock',
}

const dedupeAndSortProducts = (source: Product[]) => {
  const unique = Array.from(
    source.reduce((map, product) => {
      map.set(product.id, product)
      return map
    }, new Map<number, Product>()).values(),
  )
  unique.sort((a, b) => Number(b.id ?? 0) - Number(a.id ?? 0))
  return unique
}

const buildVariantStockPayload = (product: Product, targetTotalQty: number) => {
  const variants = Array.isArray(product.variants) ? product.variants : []
  const activeIndexes = variants
    .map((variant, index) => ({ variant, index }))
    .filter(({ variant }) => Number(variant.status ?? 1) === 1)

  if (activeIndexes.length === 0) {
    return null
  }

  const nextQtyByIndex = variants.map((variant) => Math.max(0, Math.floor(Number(variant.qty ?? 0))))
  const currentTotal = activeIndexes.reduce((sum, { index }) => sum + nextQtyByIndex[index], 0)

  if (targetTotalQty > currentTotal) {
    const firstActiveIndex = activeIndexes[0].index
    nextQtyByIndex[firstActiveIndex] += targetTotalQty - currentTotal
  } else if (targetTotalQty < currentTotal) {
    let remainingToReduce = currentTotal - targetTotalQty
    for (const { index } of activeIndexes) {
      if (remainingToReduce <= 0) break
      const reducible = Math.min(remainingToReduce, nextQtyByIndex[index])
      nextQtyByIndex[index] -= reducible
      remainingToReduce -= reducible
    }
  }

  return variants.map((variant, index) => ({
    pv_sku: variant.sku,
    pv_name: variant.name,
    pv_color: variant.color,
    pv_color_hex: variant.colorHex,
    pv_size: variant.size,
    pv_style: variant.style,
    pv_width: variant.width,
    pv_dimension: variant.dimension,
    pv_height: variant.height,
    pv_price_srp: variant.priceSrp,
    pv_price_dp: variant.priceDp,
    pv_price_member: variant.priceMember,
    pv_prodpv: variant.prodpv,
    pv_qty: nextQtyByIndex[index],
    pv_status: variant.status,
    pv_images: variant.images,
  }))
}

export default function ProductsInventoryPageMain() {
  const [filter, setFilter] = useState<StockFilter>('all')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isStockModalOpen, setIsStockModalOpen] = useState(false)
  const [stockModalMode, setStockModalMode] = useState<StockModalMode>('adjust')
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('')
  const [quantityInput, setQuantityInput] = useState('0')
  const [isSavingStock, setIsSavingStock] = useState(false)
  const [summaryMetrics, setSummaryMetrics] = useState<{
    totalProducts: number
    totalStock: number
    lowStock: number
    outOfStock: number
    categoryCount: number
  } | null>(null)
  const [isSummaryLoading, setIsSummaryLoading] = useState(false)
  const [summaryReloadKey, setSummaryReloadKey] = useState(0)
  const [fetchProductsSummary] = useLazyGetProductsQuery()
  const [updateProduct] = useUpdateProductMutation()
  const searchQuery = search.trim()
  const {
    data,
    isLoading: isProductsLoading,
    isFetching: isProductsFetching,
    isError: hasProductsError,
    refetch,
  } = useGetProductsQuery(
    {
      page: currentPage,
      perPage: PAGE_SIZE,
      search: searchQuery || undefined,
    },
    { refetchOnMountOrArgChange: true },
  )

  const products = useMemo(() => dedupeAndSortProducts(data?.products ?? []), [data?.products])
  const hasBaseData = Boolean(data)

  useEffect(() => {
    if (!hasBaseData || hasProductsError) return

    let isActive = true

    const loadSummaryMetrics = async () => {
      setIsSummaryLoading(true)
      try {
        const perPage = 5000
        const firstPage = await withTimeout(
          fetchProductsSummary({ page: 1, perPage }, false).unwrap(),
          15000,
        )
        const lastPage = Math.max(1, Number(firstPage.meta?.last_page ?? 1))
        const totalProducts = Number(firstPage.meta?.total ?? firstPage.products?.length ?? 0)
        const seenIds = new Set<number>()
        let totalStock = 0
        let lowStock = 0
        let outOfStock = 0
        const categoryIds = new Set<number>()

        const processPage = (items: Product[]) => {
          for (const product of items) {
            if (seenIds.has(product.id)) continue
            seenIds.add(product.id)
            const qty = toQuantity(product)
            totalStock += qty
            if (qty <= 0) {
              outOfStock += 1
            } else if (qty <= LOW_STOCK_THRESHOLD) {
              lowStock += 1
            }

            const categoryId = Number(product.catid ?? 0)
            if (categoryId > 0) {
              categoryIds.add(categoryId)
            }
          }
        }

        processPage(firstPage.products ?? [])

        if (lastPage > 1) {
          const pages: number[] = []
          for (let page = 2; page <= lastPage; page += 1) {
            pages.push(page)
          }

          const chunkSize = 8
          for (let index = 0; index < pages.length; index += chunkSize) {
            const chunk = pages.slice(index, index + chunkSize)
            const responses = await Promise.all(
              chunk.map((page) =>
                withTimeout(
                  fetchProductsSummary({ page, perPage }, false).unwrap(),
                  15000,
                ),
              ),
            )
            for (const response of responses) {
              processPage(response.products ?? [])
            }
          }
        }

        if (!isActive) return
        setSummaryMetrics({
          totalProducts,
          totalStock,
          lowStock,
          outOfStock,
          categoryCount: categoryIds.size,
        })
      } catch (error) {
        console.error(error)
        if (isActive) {
          setSummaryMetrics(null)
        }
      } finally {
        if (isActive) {
          setIsSummaryLoading(false)
        }
      }
    }

    void loadSummaryMetrics()

    return () => {
      isActive = false
    }
  }, [hasBaseData, data?.meta?.total, hasProductsError, fetchProductsSummary, summaryReloadKey])

  const metrics = useMemo(() => {
    if (summaryMetrics) return summaryMetrics
    const totalProducts = Number(data?.meta?.total ?? products.length)
    const totalStock = products.reduce((sum, product) => sum + toQuantity(product), 0)
    const lowStock = products.filter((product) => {
      const qty = toQuantity(product)
      return qty > 0 && qty <= LOW_STOCK_THRESHOLD
    }).length
    const outOfStock = products.filter((product) => toQuantity(product) <= 0).length
    const categoryCount = new Set(products.map((product) => Number(product.catid ?? 0)).filter((id) => id > 0)).size

    return { totalProducts, totalStock, lowStock, outOfStock, categoryCount }
  }, [products, data?.meta?.total, summaryMetrics])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const qty = toQuantity(product)
      const status = getStockStatus(qty)
      const passStatus = filter === 'all' || status === filter
      return passStatus
    })
  }, [products, filter])

  const selectedProduct = useMemo(
    () => (typeof selectedProductId === 'number' ? (products.find((product) => product.id === selectedProductId) ?? null) : null),
    [products, selectedProductId],
  )

  const openAdjustModal = (product: Product) => {
    setStockModalMode('adjust')
    setSelectedProductId(product.id)
    setQuantityInput(String(toQuantity(product)))
    setIsStockModalOpen(true)
  }

  const openRestockModal = (product?: Product) => {
    setStockModalMode('restock')
    setSelectedProductId(product?.id ?? '')
    setQuantityInput('10')
    setIsStockModalOpen(true)
  }

  const closeStockModal = () => {
    setIsStockModalOpen(false)
    setSelectedProductId('')
    setQuantityInput('0')
    setIsSavingStock(false)
  }

  const handleSaveStock = async () => {
    if (typeof selectedProductId !== 'number') {
      showErrorToast('Please select a product.')
      return
    }

    const baseProduct = products.find((product) => product.id === selectedProductId)
    if (!baseProduct) {
      showErrorToast('Selected product is not available.')
      return
    }

    const parsed = Number(quantityInput)
    if (!Number.isFinite(parsed) || parsed < 0) {
      showErrorToast('Please enter a valid quantity.')
      return
    }

    const currentQty = toQuantity(baseProduct)
    const nextQty = stockModalMode === 'adjust' ? Math.floor(parsed) : currentQty + Math.floor(parsed)
    if (stockModalMode === 'restock' && parsed <= 0) {
      showErrorToast('Restock quantity must be greater than zero.')
      return
    }

    setIsSavingStock(true)
    try {
      const variantPayload = buildVariantStockPayload(baseProduct, nextQty)
      const payload = variantPayload
        ? { pd_qty: nextQty, pd_variants: variantPayload }
        : { pd_qty: nextQty }

      await updateProduct({ id: selectedProductId, data: payload }).unwrap()
      await refetch()
      setSummaryReloadKey((value) => value + 1)
      showSuccessToast(stockModalMode === 'adjust' ? 'Stock adjusted successfully.' : 'Restock applied successfully.')
      closeStockModal()
    } catch (error) {
      console.error(error)
      showErrorToast('Failed to update stock.')
      setIsSavingStock(false)
    }
  }

  const handleExportCsv = () => {
    const rows = filteredProducts.map((product) => {
      const qty = toQuantity(product)
      const status = getStockStatus(qty)
      return {
        name: product.name,
        sku: product.sku ?? '',
        qty,
        threshold: qty,
        status: stockLabel[status],
        updated_at: product.updatedAt ?? product.createdAt ?? '',
      }
    })

    const header = ['Product name', 'SKU', 'Current stock', 'Threshold', 'Status', 'Last updated']
    const csvRows = rows.map((row) =>
      [row.name, row.sku, row.qty, `>= ${row.threshold}`, row.status, row.updated_at]
        .map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`)
        .join(','),
    )

    const csv = [header.join(','), ...csvRows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'inventory-export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Inventory</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Track stock health and identify restocking priorities.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Download size={15} />
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => openRestockModal()}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-orange-500 dark:hover:bg-orange-600"
            >
              <PackagePlus size={15} />
              Add restock
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total products"
          value={formatNumber(metrics.totalProducts)}
          subtitle={`${formatNumber(metrics.categoryCount)} categories`}
          accent="bg-sky-500"
        />
        <MetricCard
          title="Total stock"
          value={formatNumber(metrics.totalStock)}
          subtitle="units on hand"
          accent="bg-emerald-500"
        />
        <MetricCard
          title="Low stock"
          value={isSummaryLoading && !summaryMetrics ? '...' : formatNumber(metrics.lowStock)}
          subtitle={`at or below ${LOW_STOCK_THRESHOLD}`}
          accent="bg-amber-500"
        />
        <MetricCard
          title="Out of stock"
          value={isSummaryLoading && !summaryMetrics ? '...' : formatNumber(metrics.outOfStock)}
          subtitle="needs restocking"
          accent="bg-rose-500"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {(['all', 'in-stock', 'low-stock', 'out-of-stock'] as StockFilter[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setFilter(value)
              }}
              className={`rounded-xl border px-3 py-1.5 text-sm font-semibold transition ${
                filter === value
                  ? 'border-slate-900 bg-slate-900 text-white dark:border-orange-500 dark:bg-orange-500'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {stockLabel[value]}
            </button>
          ))}
          <div className="relative ml-auto w-full max-w-sm">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search product or SKU..."
              className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-orange-500"
            />
          </div>
        </div>

        {isProductsLoading || isProductsFetching ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
            Loading inventory...
          </div>
        ) : hasProductsError ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center text-sm text-rose-700 dark:border-rose-800/60 dark:bg-rose-900/20 dark:text-rose-300">
            Failed to load inventory products.
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
            No products match this inventory filter.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-800/70">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Current stock</th>
                  <th className="px-4 py-3">Threshold</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-sm dark:divide-slate-800 dark:bg-slate-900">
                {filteredProducts.map((product) => {
                  const quantity = toQuantity(product)
                  const status = getStockStatus(quantity)
                  const statusStyle =
                    status === 'in-stock'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                      : status === 'low-stock'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'

                  return (
                    <tr key={product.id}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{product.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">#{product.id}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{product.sku || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded bg-slate-200 dark:bg-slate-700">
                            <div
                              className={`h-full ${
                                status === 'in-stock' ? 'bg-emerald-500' : status === 'low-stock' ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(100, (quantity / Math.max(LOW_STOCK_THRESHOLD * 2, 1)) * 100)}%` }}
                            />
                          </div>
                          <span className="font-semibold text-slate-800 dark:text-slate-100">{formatNumber(quantity)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatNumber(quantity)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle}`}>
                          {stockLabel[status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatDate(product.updatedAt ?? product.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => (status === 'in-stock' ? openAdjustModal(product) : openRestockModal(product))}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          {status === 'in-stock' ? 'Adjust' : 'Restock'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {filteredProducts.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {filter === 'all'
                ? `Showing ${Number(data?.meta?.from ?? 0)} to ${Number(data?.meta?.to ?? filteredProducts.length)} of ${Number(data?.meta?.total ?? filteredProducts.length)} items`
                : `Showing ${filteredProducts.length} filtered items on page ${Number(data?.meta?.current_page ?? currentPage)}`}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={Number(data?.meta?.current_page ?? currentPage) <= 1}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Page {Number(data?.meta?.current_page ?? currentPage)} of {Math.max(1, Number(data?.meta?.last_page ?? 1))}
              </span>
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(Math.max(1, Number(data?.meta?.last_page ?? 1)), page + 1))
                }
                disabled={Number(data?.meta?.current_page ?? currentPage) >= Math.max(1, Number(data?.meta?.last_page ?? 1))}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {isStockModalOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {stockModalMode === 'adjust' ? 'Adjust stock' : 'Restock product'}
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                  {stockModalMode === 'adjust' ? 'Update Current Stock' : 'Add Stock Quantity'}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeStockModal}
                className="rounded-full border border-slate-300 p-1 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Product</span>
                <select
                  value={selectedProductId === '' ? '' : String(selectedProductId)}
                  onChange={(event) => {
                    const value = event.target.value
                    setSelectedProductId(value ? Number(value) : '')
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="">Select product</option>
                  {filteredProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.sku || `#${product.id}`})
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {stockModalMode === 'adjust' ? 'Set quantity' : 'Add quantity'}
                </span>
                <input
                  type="number"
                  min={0}
                  value={quantityInput}
                  onChange={(event) => setQuantityInput(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </label>

              {selectedProduct ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Current stock: <span className="font-semibold text-slate-700 dark:text-slate-200">{formatNumber(toQuantity(selectedProduct))}</span>
                </p>
              ) : null}
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeStockModal}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveStock}
                disabled={isSavingStock}
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60 dark:bg-orange-500 dark:hover:bg-orange-600"
              >
                {isSavingStock ? 'Saving...' : stockModalMode === 'adjust' ? 'Save adjustment' : 'Apply restock'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function MetricCard({
  title,
  value,
  subtitle,
  accent,
}: {
  title: string
  value: string
  subtitle: string
  accent: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded bg-slate-200 dark:bg-slate-700">
        <div className={`h-full w-2/3 ${accent}`} />
      </div>
    </div>
  )
}
