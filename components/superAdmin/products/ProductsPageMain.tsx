'use client'

import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useGetAdminMeQuery } from '@/store/api/authApi'
import { Product, useGetProductsQuery, useGetPublicProductsQuery, useDeleteProductMutation, useManualCheckoutApplyMutation, useFetchZqImportPreviewMutation, ProductsResponse } from "@/store/api/productsApi";
import { useGetAdminGeneralSettingsQuery, useUpdateAdminGeneralSettingsMutation } from "@/store/api/adminSettingsApi";
import { useGetPublicProductBrandsQuery } from "@/store/api/productBrandsApi";
import { useGetSuppliersQuery } from "@/store/api/suppliersApi";
import ProductsToolbar from './ProductsToolbar'
import ProductsTable from './ProductsTable'
import DataTableShell from '../DataTableShell'
import AddProductModal from './AddProductModal'
import EditProductModal from './EditProductModal'
import BulkEditProductsModal from './BulkEditProductsModal'
import ProductActivityLogsModal from './ProductActivityLogsModal'
import { showErrorToast, showSuccessToast } from '@/libs/toast'
import { revalidateStorefront } from '@/libs/revalidateStorefront'

interface ProductsPageMainProps {
  initialData?: ProductsResponse | null
  initialBrandType?: number
}

const NEW_BADGE_DAYS = 7

const isNewProduct = (product: Product) => {
  if (!product.createdAt) return false

  const createdAt = new Date(product.createdAt)
  if (Number.isNaN(createdAt.getTime())) return false

  const diffDays = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays >= 0 && diffDays < NEW_BADGE_DAYS
}

const getEffectiveStockQty = (product: Product) => {
  const activeVariants = (product.variants ?? []).filter((variant) => Number(variant.status ?? 1) === 1)

  if (activeVariants.length === 0) {
    return Number(product.qty ?? 0)
  }

  return activeVariants.reduce((total, variant) => total + Number(variant.qty ?? 0), 0)
}

/* ── Stat card ── */
function StatCard({
  label, value, sub, icon, colorClass,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ReactNode
  colorClass: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 flex items-center gap-3 dark:border-slate-800 dark:bg-slate-900">
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-slate-800 leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{label}</p>
        {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function ManualCheckoutSelectionModal({
  products,
  onConfirm,
  onRemove,
  onClose,
  isSaving = false,
  removingIds = [],
  mode = 'review',
}: {
  products: Product[]
  onConfirm: () => void
  onRemove?: (product: Product) => void
  onClose: () => void
  isSaving?: boolean
  removingIds?: number[]
  mode?: 'review' | 'view'
}) {
  const isViewMode = mode === 'view'
  const eyebrow = isViewMode ? 'Manual Checkout Products' : 'Manual Checkout Review'
  const title = isViewMode ? 'Added Products' : 'Selected Products'
  const description = isViewMode
    ? 'These products are already included in the manual checkout flow.'
    : 'Review the selected products that can proceed under the manual checkout flow.'
  const summaryLabel = isViewMode ? 'manual checkout product' : 'selected product'
  const primaryLabel = isViewMode ? 'Already Added to Manual Checkout' : 'Add to Manual Checkout'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600">{eyebrow}</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Close
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ delay: 0.05, duration: 0.2, ease: 'easeOut' }}
            className="space-y-4 p-6"
          >
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="max-h-[55vh] overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/70">
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-300">Image</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-300">Product</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-300">Brand</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-300">SKU</th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-300">Stock</th>
                    {isViewMode ? (
                      <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-300">Action</th>
                    ) : null}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                  {products.map((product) => {
                    const isRemoving = removingIds.includes(product.id)

                    return (
                      <tr
                        key={product.id}
                        className="bg-white dark:bg-slate-900"
                      >
                        <td className="px-5 py-3.5">
                          <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                            {product.image ? (
                              <Image src={product.image} alt={product.name} fill className="object-cover" unoptimized />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <svg className="h-5 w-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="min-w-0">
                            <p className="line-clamp-1 font-semibold text-slate-800 dark:text-slate-100">{product.name}</p>
                            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">#{product.id}</p>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {product.brand || 'Unbranded'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs text-slate-500 dark:text-slate-400">{product.sku || 'N/A'}</td>
                        <td className="px-5 py-3.5 text-right text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {getEffectiveStockQty(product).toLocaleString()}
                        </td>
                        {isViewMode ? (
                          <td className="px-5 py-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => onRemove?.(product)}
                              disabled={isRemoving}
                              className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isRemoving ? 'Removing...' : 'Remove'}
                            </button>
                          </td>
                        ) : null}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/60">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-100">{products.length}</span> {summaryLabel}{products.length !== 1 ? 's' : ''}
            </p>
            <button
              type="button"
              onClick={isViewMode ? onClose : onConfirm}
              disabled={(!isViewMode && isSaving) || products.length === 0}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                isViewMode
                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'bg-teal-600 text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-300'
              }`}
            >
              {isSaving && !isViewMode ? 'Saving...' : primaryLabel}
            </button>
          </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function ZqImportPreviewModal({
  json,
  onClose,
}: {
  json: string
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/55 p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        >
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">ZQ Product Preview</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">Import Product List JSON</h2>
              <p className="mt-1 text-sm text-slate-500">This is the raw ZQ response so we can validate the product listing payload first.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>

          <div className="max-h-[75vh] overflow-auto bg-slate-950 p-5">
            <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-6 text-emerald-100">
              {json}
            </pre>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function ProductsPageMain({ initialData = null, initialBrandType }: ProductsPageMainProps) {
  const selectionPerPage = 5000
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const supplierName = String((session?.user as { supplierName?: string | null; name?: string | null } | undefined)?.supplierName
    ?? (session?.user as { name?: string | null } | undefined)?.name
    ?? '')
  const sessionAccessToken = String((session?.user as { accessToken?: string } | undefined)?.accessToken ?? '')
  const isAdminRoute = pathname.startsWith('/admin')
  const adminIdentityKey = sessionAccessToken
    ? `${String((session?.user as { id?: string } | undefined)?.id ?? 'unknown')}:${sessionAccessToken}`
    : undefined
  const { data: adminMe } = useGetAdminMeQuery(adminIdentityKey, { skip: !sessionAccessToken || !isAdminRoute })
  const role = String(adminMe?.role ?? session?.user?.role ?? '').toLowerCase()
  const isSupplierPortal = role === 'supplier' || pathname.startsWith('/supplier')
  const linkedSupplierId = Number(adminMe?.supplier_id ?? session?.user?.supplierId ?? 0)
  const [search,          setSearch]          = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status,          setStatus]          = useState('')
  const [catId,           setCatId]           = useState<number | undefined>(undefined)
  const [brandType,       setBrandType]       = useState<number | undefined>(
    typeof initialBrandType === 'number' && initialBrandType > 0 ? initialBrandType : undefined,
  )
  const [supplierFilterId, setSupplierFilterId] = useState<number | undefined>(undefined)
  const [page,            setPage]            = useState(1)
  const [showAddModal,    setShowAddModal]    = useState(false)
  const [showActivityLogs, setShowActivityLogs] = useState(false)
  const [showZqPreviewModal, setShowZqPreviewModal] = useState(false)
  const [zqPreviewJson, setZqPreviewJson] = useState('')
  const [showManualSelectionModal, setShowManualSelectionModal] = useState(false)
  const [manualSelectionProducts, setManualSelectionProducts] = useState<Product[]>([])
  const [manualSelectionMode, setManualSelectionMode] = useState<'review' | 'view'>('review')
  const [editProduct,     setEditProduct]     = useState<Product | null>(null)
  const [showBulkEdit,    setShowBulkEdit]    = useState(false)
  const [deletingIds,     setDeletingIds]     = useState<number[]>([])
  const [removingManualCheckoutIds, setRemovingManualCheckoutIds] = useState<number[]>([])
  const [selectedIds,     setSelectedIds]     = useState<number[]>([])
  const [applyManualCheckout, { isLoading: isApplyingManualCheckout }] = useManualCheckoutApplyMutation()
  const [fetchZqImportPreview, { isLoading: isFetchingZqPreview }] = useFetchZqImportPreviewMutation()
  const [saveGeneralSettings, { isLoading: isSavingManualMode }] = useUpdateAdminGeneralSettingsMutation()
  const [productOverrides, setProductOverrides] = useState<Record<number, Product>>({})
  const [createdProducts, setCreatedProducts] = useState<Product[]>([])
  const [useInitialData,  setUseInitialData]  = useState(Boolean(initialData))
  const defaultPerPage = 25
  const searchPerPage = 500
  const perPage = debouncedSearch ? searchPerPage : defaultPerPage

  const { data: adminGeneralSettingsData } = useGetAdminGeneralSettingsQuery()
  const manualHeaderToggle = Boolean(adminGeneralSettingsData?.settings?.enable_manual_checkout_mode)

  useEffect(() => {
    const modal = (searchParams.get('modal') ?? '').toLowerCase()
    if (modal === 'add-product') {
      setShowAddModal(true)
    }
  }, [searchParams])

  const { data: supplierBrandsData } = useGetPublicProductBrandsQuery(undefined, { skip: !isSupplierPortal })
  const { data: supplierListData } = useGetSuppliersQuery(undefined, { skip: isSupplierPortal })
  const supplierRecord = useMemo(() => {
    if (!isSupplierPortal) return undefined
    const suppliers = supplierListData?.suppliers ?? []
    if (linkedSupplierId > 0) {
      return suppliers.find((supplier) => supplier.id === linkedSupplierId) ?? suppliers[0]
    }
    return suppliers[0]
  }, [isSupplierPortal, linkedSupplierId, supplierListData?.suppliers])

  useEffect(() => {
    if (!isSupplierPortal || brandType !== undefined) return
    const brands = supplierBrandsData?.brands ?? []
    if (brands.length === 0) return
    const candidates = [
      supplierName,
      supplierRecord?.company,
      supplierRecord?.name,
    ]
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map((value) => value.toLowerCase().replace(/[^a-z0-9]/g, ''))
    if (candidates.length === 0) return
    const pickBestBrandId = () => {
      const exactMatch = brands.find((brand) => {
        const brandKey = String(brand.name ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')
        return brandKey !== '' && candidates.some((candidate) => candidate === brandKey)
      })
      if (exactMatch?.id) {
        return Number(exactMatch.id)
      }

      let bestId = 0
      let bestScore = 0
      let bestLen = 0
      brands.forEach((brand) => {
        const brandKey = String(brand.name ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')
        if (!brandKey) return
        candidates.forEach((candidate) => {
          if (!candidate) return
          let score = 0
          if (candidate === brandKey) score = 3
          else if (candidate.includes(brandKey)) score = 2
          else if (brandKey.includes(candidate)) score = 1
          if (score > 0) {
            const len = brandKey.length
            if (score > bestScore || (score === bestScore && len > bestLen)) {
              bestScore = score
              bestLen = len
              bestId = Number(brand.id ?? 0)
            }
          }
        })
      })
      return bestId
    }

    const matchId = pickBestBrandId()
    if (matchId > 0) {
      setBrandType(matchId)
    }
  }, [brandType, isSupplierPortal, supplierBrandsData?.brands, supplierName, supplierRecord?.company, supplierRecord?.name])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => clearTimeout(t)
  }, [search])

  const adminQueryArgs = {
    page: debouncedSearch ? 1 : page,
    perPage,
    search: debouncedSearch || undefined,
    status: status === 'new' ? undefined : (status || undefined),
    catId,
    brandType,
    supplierId: isSupplierPortal && linkedSupplierId > 0 ? linkedSupplierId : supplierFilterId,
  }
  const publicQueryArgs = {
    page: debouncedSearch ? 1 : page,
    perPage,
    search: debouncedSearch || undefined,
    status: status === 'new' ? undefined : (status || undefined),
    catId,
    brandType,
    supplierId: isSupplierPortal && linkedSupplierId > 0 ? linkedSupplierId : undefined,
  }

  const {
    data: adminData,
    isLoading: isAdminLoading,
    isFetching: isAdminFetching,
    isError: isAdminError,
    error: adminError,
    refetch: refetchAdminProducts,
  } = useGetProductsQuery(adminQueryArgs, { skip: isSupplierPortal, refetchOnMountOrArgChange: true })

  const {
    data: publicData,
    isLoading: isPublicLoading,
    isFetching: isPublicFetching,
    isError: isPublicError,
    error: publicError,
    refetch: refetchPublicProducts,
  } = useGetPublicProductsQuery(publicQueryArgs, { skip: !isSupplierPortal, refetchOnMountOrArgChange: true })

  const data = isSupplierPortal ? publicData : adminData
  const isLoading = isSupplierPortal ? isPublicLoading : isAdminLoading
  const isFetching = isSupplierPortal ? isPublicFetching : isAdminFetching
  const isError = isSupplierPortal ? isPublicError : isAdminError
  const error = isSupplierPortal ? publicError : adminError
  const refetchProducts = isSupplierPortal ? refetchPublicProducts : refetchAdminProducts

  const adminSelectionQueryArgs = {
    ...adminQueryArgs,
    page: 1,
    perPage: selectionPerPage,
  }
  const publicSelectionQueryArgs = {
    ...publicQueryArgs,
    page: 1,
    perPage: selectionPerPage,
  }

  const { data: adminSelectionData } = useGetProductsQuery(
    adminSelectionQueryArgs,
    { skip: isSupplierPortal, refetchOnMountOrArgChange: true },
  )
  const { data: publicSelectionData } = useGetPublicProductsQuery(
    publicSelectionQueryArgs,
    { skip: !isSupplierPortal, refetchOnMountOrArgChange: true },
  )

  const selectionData = isSupplierPortal ? publicSelectionData : adminSelectionData

  /* Lightweight count queries for stats */
  const activeCountArgs = {
    perPage: 1,
    status: '1',
    supplierId: isSupplierPortal && linkedSupplierId > 0 ? linkedSupplierId : supplierFilterId,
    brandType: isSupplierPortal ? brandType : undefined,
  }
  const inactiveCountArgs = {
    perPage: 1,
    status: '0',
    supplierId: isSupplierPortal && linkedSupplierId > 0 ? linkedSupplierId : supplierFilterId,
    brandType: isSupplierPortal ? brandType : undefined,
  }

  const { data: adminActiveCountData, refetch: refetchAdminActiveCount } = useGetProductsQuery(
    activeCountArgs,
    { skip: isSupplierPortal, refetchOnMountOrArgChange: true },
  )
  const { data: adminInactiveCountData, refetch: refetchAdminInactiveCount } = useGetProductsQuery(
    inactiveCountArgs,
    { skip: isSupplierPortal, refetchOnMountOrArgChange: true },
  )
  const { data: publicActiveCountData, refetch: refetchPublicActiveCount } = useGetPublicProductsQuery(
    activeCountArgs,
    { skip: !isSupplierPortal, refetchOnMountOrArgChange: true },
  )
  const { data: publicInactiveCountData, refetch: refetchPublicInactiveCount } = useGetPublicProductsQuery(
    inactiveCountArgs,
    { skip: !isSupplierPortal, refetchOnMountOrArgChange: true },
  )

  const activeCountData = isSupplierPortal ? publicActiveCountData : adminActiveCountData
  const inactiveCountData = isSupplierPortal ? publicInactiveCountData : adminInactiveCountData
  const refetchActiveCount = isSupplierPortal ? refetchPublicActiveCount : refetchAdminActiveCount
  const refetchInactiveCount = isSupplierPortal ? refetchPublicInactiveCount : refetchAdminInactiveCount

  const [deleteProduct] = useDeleteProductMutation()

  useEffect(() => {
    if (data) {
      setUseInitialData(false)
    }
  }, [data])

  const handleProductsSaved = (updatedProduct?: Product) => {
    setUseInitialData(false)
    if (updatedProduct) {
      setProductOverrides((prev) => ({ ...prev, [updatedProduct.id]: updatedProduct }))
      setCreatedProducts((prev) => {
        const next = [updatedProduct, ...prev.filter((product) => product.id !== updatedProduct.id)]
        return next
      })
    }
    router.refresh()
    void revalidateStorefront()
    if (page !== 1) {
      setPage(1)
    } else {
      void refetchProducts()
    }
    void refetchActiveCount()
    void refetchInactiveCount()
  }

  const products = useMemo(() => {
    const rawProducts = data?.products
      ? data.products
      : (useInitialData ? (initialData?.products ?? []) : [])
    const mergedProducts = rawProducts.map((product) => productOverrides[product.id] ?? product)
    const mergedById = new Map<number, Product>()

    createdProducts.forEach((product) => {
      mergedById.set(product.id, productOverrides[product.id] ?? product)
    })

    mergedProducts.forEach((product) => {
      mergedById.set(product.id, product)
    })

    const mergedProductList = Array.from(mergedById.values())

      if (!isSupplierPortal || linkedSupplierId <= 0) {
      return mergedProductList.filter((product) => {
        if (!supplierFilterId || supplierFilterId <= 0) return true
        return Number(product.supplierId ?? 0) === supplierFilterId
      })
      }

    return mergedProductList.filter((product) => {
      const matchesSupplier = Number(product.supplierId ?? 0) === linkedSupplierId
      const matchesBrand = typeof brandType === 'number' && brandType > 0
        ? Number(product.brandType ?? 0) === brandType
        : false
      return matchesSupplier || matchesBrand
    })
  }, [brandType, createdProducts, data?.products, initialData?.products, isSupplierPortal, linkedSupplierId, productOverrides, supplierFilterId, useInitialData])

  const visibleProducts = useMemo(() => {
    const baseProducts = status === 'new' ? products.filter(isNewProduct) : products
    const categoryFiltered =
      typeof catId === 'number' && catId > 0
        ? baseProducts.filter((product) => Number(product.catid ?? 0) === catId)
        : baseProducts
    const keyword = debouncedSearch.trim().toLowerCase()
    if (!keyword) return categoryFiltered

    const terms = keyword.split(/\s+/).filter(Boolean)
    if (terms.length === 0) return categoryFiltered

    return categoryFiltered.filter((product) => {
      const haystacks = [
        product.name,
        product.sku,
        product.description,
        product.specifications,
        product.material,
        product.brand,
        ...(product.variants ?? []).flatMap((variant) => [
          variant.sku,
          variant.name,
          variant.color,
          variant.size,
        ]),
      ]
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
        .map((value) => value.toLowerCase())

      return terms.every((term) => haystacks.some((value) => value.includes(term)))
    })
  }, [catId, debouncedSearch, products, status])

  const selectableProducts = useMemo(() => {
    const selectionSource = selectionData?.products
      ? selectionData.products
      : products
    const mergedSelection = selectionSource.map((product) => productOverrides[product.id] ?? product)
    const mergedById = new Map<number, Product>()

    createdProducts.forEach((product) => {
      const candidate = productOverrides[product.id] ?? product
      const matchesSupplierFilter = !supplierFilterId || supplierFilterId <= 0 || Number(candidate.supplierId ?? 0) === supplierFilterId
      const matchesLinkedSupplier = !isSupplierPortal || linkedSupplierId <= 0
        ? true
        : Number(candidate.supplierId ?? 0) === linkedSupplierId
          || (typeof brandType === 'number' && brandType > 0 && Number(candidate.brandType ?? 0) === brandType)

      if (matchesSupplierFilter && matchesLinkedSupplier) {
        mergedById.set(candidate.id, candidate)
      }
    })

    mergedSelection.forEach((product) => {
      mergedById.set(product.id, product)
    })

    const rows = Array.from(mergedById.values())
    return status === 'new' ? rows.filter(isNewProduct) : rows
  }, [
    brandType,
    createdProducts,
    isSupplierPortal,
    linkedSupplierId,
    productOverrides,
    products,
    selectionData?.products,
    status,
    supplierFilterId,
  ])

  const selectableIds = useMemo(
    () => new Set(selectableProducts.map((product) => product.id)),
    [selectableProducts],
  )

  const meta = useMemo(() => {
    return data?.meta ?? (useInitialData ? initialData?.meta : undefined)
  }, [data?.meta, initialData?.meta, useInitialData])

  const visibleMeta = useMemo(() => {
    if (!manualHeaderToggle && !debouncedSearch && status !== 'new') {
      return meta
    }

    return {
      current_page: 1,
      last_page: 1,
      per_page: visibleProducts.length || perPage,
      total: visibleProducts.length,
      from: visibleProducts.length > 0 ? 1 : 0,
      to: visibleProducts.length,
    }
  }, [debouncedSearch, manualHeaderToggle, meta, perPage, status, visibleProducts.length])

  /* Low-stock count from current page */
  const lowStockCount = useMemo(
    () => visibleProducts.filter((product) => {
      const qty = getEffectiveStockQty(product)
      return qty > 0 && qty <= 5
    }).length,
    [visibleProducts],
  )

  const handleSearch = (v: string) => { setSearch(v); setPage(1) }
  const handleStatus = (v: string) => { setStatus(v); setPage(1) }
  const handleCatId  = (v: number | undefined) => { setCatId(v); setPage(1) }
  const handleBrandType  = (v: number | undefined) => { setBrandType(v); setPage(1) }
  const handleSupplierFilterId = (v: number | undefined) => { setSupplierFilterId(v); setPage(1) }

  const supplierOptions = useMemo(
    () => (supplierListData?.suppliers ?? []).map((supplier) => ({
      id: supplier.id,
      label: supplier.company?.trim() || supplier.name?.trim() || `Supplier #${supplier.id}`,
    })),
    [supplierListData?.suppliers],
  )

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => selectableIds.has(id)))
  }, [selectableIds])

  useEffect(() => {
    setSelectedIds([])
  }, [manualHeaderToggle])

  const handleToggleManualCheckoutMode = async () => {
    const nextValue = !manualHeaderToggle
    const payload = new FormData()
    payload.append('enable_manual_checkout_mode', nextValue ? '1' : '0')

    try {
      await saveGeneralSettings(payload).unwrap()
      showSuccessToast(nextValue ? 'Manual checkout mode enabled.' : 'Manual checkout mode disabled.')
    } catch (error) {
      const apiError = error as { data?: { message?: string } }
      showErrorToast(apiError?.data?.message || 'Failed to update manual checkout mode.')
    }
  }

  const handleFetchZqPreview = async () => {
    try {
      const response = await fetchZqImportPreview({ size: 20 }).unwrap()
      setZqPreviewJson(JSON.stringify(response, null, 2))
      setShowZqPreviewModal(true)
      showSuccessToast(response.message || 'ZQ product list fetched successfully.')
    } catch (error) {
      const apiError = error as { data?: { message?: string } }
      showErrorToast(apiError?.data?.message || 'Failed to fetch ZQ product list preview.')
    }
  }

  const handleDelete = async (id: number) => {
    setDeletingIds(prev => [...prev, id])
    try {
      await deleteProduct(id).unwrap()
      await revalidateStorefront()
      setProductOverrides((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
      setCreatedProducts((prev) => prev.filter((product) => product.id !== id))
      setSelectedIds(prev => prev.filter(item => item !== id))
      showSuccessToast('Product deleted successfully.')
    } catch {
      showErrorToast('Failed to delete product.')
    } finally {
      setDeletingIds(prev => prev.filter(item => item !== id))
    }
  }

  const handleToggleSelect    = (id: number) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleToggleSelectAll = () => {
    const matchingIds = selectableProducts.map((product) => product.id)
    const allSelected = matchingIds.length > 0 && matchingIds.every((id) => selectedIds.includes(id))
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !selectableIds.has(id)))
      return
    }

    setSelectedIds((prev) => Array.from(new Set([...prev, ...matchingIds])))
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    const ids = [...selectedIds]
    setDeletingIds(prev => Array.from(new Set([...prev, ...ids])))
    try {
      await Promise.all(ids.map(id => deleteProduct(id).unwrap()))
      await revalidateStorefront()
      setProductOverrides((prev) => {
        const next = { ...prev }
        ids.forEach((id) => delete next[id])
        return next
      })
      setCreatedProducts((prev) => prev.filter((product) => !ids.includes(product.id)))
      setSelectedIds([])
      showSuccessToast(`${ids.length} product(s) deleted successfully.`)
    } catch {
      showErrorToast('Failed to delete selected products.')
    } finally {
      setDeletingIds(prev => prev.filter(id => !ids.includes(id)))
    }
  }

  const selectedProducts = useMemo(
    () => selectableProducts.filter((product) => selectedIds.includes(product.id)),
    [selectableProducts, selectedIds],
  )

  const manualCheckoutProducts = useMemo(
    () => selectableProducts.filter((product) => Boolean(product.manualCheckoutEnabled)),
    [selectableProducts],
  )

  const openManualSelectionModal = (products: Product[], mode: 'review' | 'view' = 'review') => {
    if (products.length === 0) {
      showErrorToast(mode === 'view' ? 'No manual checkout products found yet.' : 'Select at least one product first.')
      return
    }

    setManualSelectionProducts(products)
    setManualSelectionMode(mode)
    setShowManualSelectionModal(true)
  }

  const closeManualSelectionModal = () => {
    setShowManualSelectionModal(false)
    setManualSelectionProducts([])
    setManualSelectionMode('review')
  }

  const handleApplyManualCheckout = async () => {
    if (manualSelectionProducts.length === 0) {
      showErrorToast('Select at least one product first.')
      return
    }

    try {
      const result = await applyManualCheckout({
        product_ids: manualSelectionProducts.map((product) => product.id),
        enabled: true,
      }).unwrap()

      const updatedIds = new Set(
        result.results
          .filter((row) => row.status === 'updated')
          .map((row) => row.product_id),
      )
      const failedCount = Number(result.summary?.failed ?? 0)

      if (updatedIds.size > 0) {
        setProductOverrides((current) => {
          const next = { ...current }
          manualSelectionProducts.forEach((product) => {
            if (updatedIds.has(product.id)) {
              next[product.id] = {
                ...product,
                manualCheckoutEnabled: true,
              }
            }
          })
          return next
        })
      }

      setSelectedIds((current) => current.filter((id) => !updatedIds.has(id)))
      closeManualSelectionModal()

      if (updatedIds.size > 0 && failedCount === 0) {
        showSuccessToast(result.message || 'Selected products were added to manual checkout.')
        return
      }

      if (updatedIds.size > 0 && failedCount > 0) {
        showSuccessToast(`${updatedIds.size} product(s) added to manual checkout.`)
        const firstFailure = result.results.find((row) => row.status === 'failed')?.message
        if (firstFailure) {
          showErrorToast(firstFailure)
        }
        return
      }

      showErrorToast(result.results.find((row) => row.status === 'failed')?.message || result.message || 'No products were added to manual checkout.')
    } catch (error) {
      const apiError = error as { data?: { message?: string } }
      showErrorToast(apiError?.data?.message || 'Failed to save manual checkout products.')
    }
  }

  const handleRemoveManualCheckout = async (product: Product) => {
    setRemovingManualCheckoutIds((current) => Array.from(new Set([...current, product.id])))
    try {
      const result = await applyManualCheckout({
        product_ids: [product.id],
        enabled: false,
      }).unwrap()

      const updated = result.results.find((row) => row.product_id === product.id && row.status === 'updated')
      if (!updated) {
        showErrorToast(result.results.find((row) => row.product_id === product.id)?.message || result.message || 'Failed to remove product from manual checkout.')
        return
      }

      setProductOverrides((current) => ({
        ...current,
        [product.id]: {
          ...product,
          manualCheckoutEnabled: false,
        },
      }))
      setManualSelectionProducts((current) => {
        const next = current.filter((item) => item.id !== product.id)
        if (next.length === 0) {
          setShowManualSelectionModal(false)
          setManualSelectionMode('review')
        }
        return next
      })
      showSuccessToast(updated.message || `${product.name} removed from manual checkout.`)
    } catch (error) {
      const apiError = error as { data?: { message?: string } }
      showErrorToast(apiError?.data?.message || 'Failed to remove product from manual checkout.')
    } finally {
      setRemovingManualCheckoutIds((current) => current.filter((id) => id !== product.id))
    }
  }

  const loadErrorMessage = useMemo(() => {
    if (!error || typeof error !== 'object') {
      return 'Failed to load products. Please try again.'
    }

    if ('status' in error && error.status === 401) {
      return 'Your session may have expired. Please sign in again.'
    }

    if ('data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
      const message = error.data.message
      if (typeof message === 'string' && message.trim().length > 0) {
        return message
      }
    }

    if ('error' in error && typeof error.error === 'string' && error.error.trim().length > 0) {
      return error.error
    }

    return 'Failed to load products. Please try again.'
  }, [error])

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Products</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {manualHeaderToggle ? 'Viewing products assigned to manual checkout.' : 'Manage your product catalog'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleToggleManualCheckoutMode}
              disabled={isSavingManualMode}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${
                manualHeaderToggle
                  ? 'border-teal-200 bg-teal-50 text-teal-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className={`relative h-5 w-9 rounded-full transition-colors ${manualHeaderToggle ? 'bg-teal-500' : 'bg-slate-200'}`}>
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${manualHeaderToggle ? 'left-4' : 'left-0.5'}`} />
              </div>
              <span className="hidden sm:inline">
                {isSavingManualMode
                  ? 'Saving...'
                  : manualHeaderToggle
                    ? 'Manual Checkout On'
                    : 'Manual Checkout Off'}
              </span>
              <span className="sm:hidden">Manual</span>
            </button>
          <button
            type="button"
            onClick={handleFetchZqPreview}
            disabled={isFetchingZqPreview}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl text-sm font-semibold transition-colors border border-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v4H4zm0 8h16v8H4zm4 4h.01M12 16h4" />
            </svg>
            <span className="hidden sm:inline">{isFetchingZqPreview ? 'Fetching ZQ JSON...' : 'Fetch ZQ JSON'}</span>
            <span className="sm:hidden">ZQ JSON</span>
          </button>
          <button
            onClick={() => setShowActivityLogs(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors border border-slate-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m-6 9 2 2 4-4"/>
            </svg>
            <span className="hidden sm:inline">Upload History</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </motion.div>

      {/* ── Stats strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        <StatCard
          label="Total Products"
          value={isLoading ? '—' : (meta?.total ?? products.length).toLocaleString()}
          colorClass="bg-teal-100"
          icon={
            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          }
        />
        <StatCard
          label="Active"
          value={activeCountData ? (activeCountData.meta?.total ?? 0).toLocaleString() : '—'}
          colorClass="bg-emerald-100"
          icon={
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          }
        />
        <StatCard
          label="Inactive"
          value={inactiveCountData ? (inactiveCountData.meta?.total ?? 0).toLocaleString() : '—'}
          colorClass="bg-slate-100"
          icon={
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          }
        />
        <StatCard
          label="Low Stock"
          value={isLoading ? '—' : lowStockCount}
          sub="on this page (qty ≤ 5)"
          colorClass={lowStockCount > 0 ? 'bg-orange-100' : 'bg-slate-100'}
          icon={
            <svg className={`w-5 h-5 ${lowStockCount > 0 ? 'text-orange-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          }
        />
      </motion.div>

      {/* ── Toolbar ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <ProductsToolbar
          search={search} onSearch={handleSearch}
          status={status} onStatus={handleStatus}
          catId={catId}   onCatId={handleCatId}
          brandType={brandType} onBrandType={handleBrandType}
          showBrandFilter={!isSupplierPortal}
          resultCount={visibleMeta?.total ?? visibleProducts.length}
          supplierId={isSupplierPortal && linkedSupplierId > 0 ? linkedSupplierId : undefined}
          supplierFilterId={!isSupplierPortal ? supplierFilterId : undefined}
          onSupplierFilterId={!isSupplierPortal ? handleSupplierFilterId : undefined}
          supplierOptions={!isSupplierPortal ? supplierOptions : undefined}
          selectedCount={selectedIds.length}
          onViewSelected={() => openManualSelectionModal(selectedProducts)}
          manualCheckoutCount={manualCheckoutProducts.length}
          onViewManualCheckout={() => openManualSelectionModal(manualCheckoutProducts, 'view')}
        />
      </motion.div>

      {/* ── Content ── */}
      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{loadErrorMessage}</div>
      ) : isLoading && !data && !initialData ? (
        <SkeletonTable />
      ) : (
        <div className="space-y-2">
          {/* Fetching indicator */}
          {isFetching && (
            <div className="google-loading-bar" />
          )}

          {/* Bulk action bar */}
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 gap-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-red-100 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <p className="text-sm text-red-700">
                  <span className="font-semibold">{selectedIds.length}</span> product{selectedIds.length !== 1 ? 's' : ''} selected
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openManualSelectionModal(selectedProducts)}
                  className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-xs font-semibold text-teal-700 transition-colors hover:border-teal-300 hover:bg-teal-50"
                >
                  Add to Manual Checkout
                </button>
                <button
                  onClick={() => setShowBulkEdit(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-slate-700 border border-red-200 hover:border-teal-300 hover:text-teal-700 transition-colors text-xs font-semibold"
                >
                  Bulk Edit
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={deletingIds.length > 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors disabled:opacity-60"
                >
                  {deletingIds.length > 0 ? 'Deleting…' : `Delete ${selectedIds.length}`}
                </button>
              </div>
            </div>
          )}

          <DataTableShell>
            <ProductsTable
              rows={visibleProducts}
              currentPage={visibleMeta?.current_page ?? 1}
              totalPages={visibleMeta?.last_page ?? 1}
              totalRecords={visibleMeta?.total ?? visibleProducts.length}
              from={visibleMeta?.from ?? null}
              to={visibleMeta?.to ?? null}
              onPageChange={setPage}
              onEdit={setEditProduct}
              onDelete={handleDelete}
              isDeletingIds={deletingIds}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onToggleSelectAll={handleToggleSelectAll}
              onViewManualCheckout={(product) => openManualSelectionModal([product])}
            />
          </DataTableShell>
        </div>
      )}

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          if ((searchParams.get('modal') ?? '').toLowerCase() === 'add-product') {
            router.replace(pathname)
          }
        }}
        onSaved={handleProductsSaved}
      />
      <ProductActivityLogsModal isOpen={showActivityLogs} onClose={() => setShowActivityLogs(false)} />
      <EditProductModal product={editProduct} onClose={() => setEditProduct(null)} onSaved={handleProductsSaved}/>
      <BulkEditProductsModal
        products={showBulkEdit ? selectedProducts : []}
        onClose={() => setShowBulkEdit(false)}
        onSaved={() => {
          setSelectedIds([])
          handleProductsSaved()
        }}
      />
      {showManualSelectionModal ? (
        <ManualCheckoutSelectionModal
          products={manualSelectionProducts}
          onConfirm={handleApplyManualCheckout}
          onRemove={handleRemoveManualCheckout}
          onClose={closeManualSelectionModal}
          isSaving={isApplyingManualCheckout}
          removingIds={removingManualCheckoutIds}
          mode={manualSelectionMode}
        />
      ) : null}
      {showZqPreviewModal ? (
        <ZqImportPreviewModal
          json={zqPreviewJson}
          onClose={() => setShowZqPreviewModal(false)}
        />
      ) : null}
    </div>
  )
}

function SkeletonTable() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 animate-pulse space-y-3">
      <div className="grid grid-cols-9 gap-3 mb-3">
        {Array.from({ length: 9 }).map((_, i) => <div key={i} className="h-3 rounded bg-slate-200"/>)}
      </div>
      {Array.from({ length: 8 }).map((_, ri) => (
        <div key={ri} className="grid grid-cols-9 gap-3">
          {Array.from({ length: 9 }).map((_, ci) => <div key={ci} className="h-8 rounded bg-slate-100"/>)}
        </div>
      ))}
    </div>
  )
}
