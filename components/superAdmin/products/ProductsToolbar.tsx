'use client'

import { useGetCategoriesQuery } from '@/store/api/categoriesApi'
import { useGetProductBrandsQuery } from '@/store/api/productBrandsApi'

interface ProductsToolbarProps {
  search: string
  onSearch: (v: string) => void
  status: string
  onStatus: (v: string) => void
  catId: number | undefined
  onCatId: (v: number | undefined) => void
  brandType: number | undefined
  onBrandType: (v: number | undefined) => void
  showBrandFilter?: boolean
  resultCount: number
  supplierId?: number
  supplierFilterId?: number
  onSupplierFilterId?: (v: number | undefined) => void
  supplierOptions?: Array<{ id: number; label: string }>
}

const STATUS_TABS = [
  { value: '',  label: 'All'      },
  { value: '1', label: 'Active'   },
  { value: '0', label: 'Inactive' },
  { value: 'new', label: 'New' },
]

export default function ProductsToolbar({
  search,
  onSearch,
  status,
  onStatus,
  catId,
  onCatId,
  brandType,
  onBrandType,
  showBrandFilter = true,
  resultCount,
  supplierId,
  supplierFilterId,
  onSupplierFilterId,
  supplierOptions = [],
}: ProductsToolbarProps) {
  const { data: categoriesData } = useGetCategoriesQuery(
    supplierId && supplierId > 0
      ? { supplier_id: supplierId }
      : undefined
  )
  const { data: brandsData } = useGetProductBrandsQuery(undefined, { skip: !showBrandFilter })
  const categories = categoriesData?.categories ?? []
  const brands = brandsData?.brands ?? []
  const hasSupplierScopedCategories = !supplierId || supplierId <= 0 || categories.length > 0

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Status filter */}
      <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl gap-0.5 shrink-0">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => onStatus(tab.value)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              status === tab.value
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="relative shrink-0">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16"/>
        </svg>
        <select
          value={catId ?? ''}
          onChange={e => onCatId(e.target.value === '' ? undefined : Number(e.target.value))}
          disabled={!hasSupplierScopedCategories}
          className={`pl-9 pr-8 py-2.5 bg-white border rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 appearance-none cursor-pointer ${
            catId !== undefined
              ? 'border-teal-400 text-teal-700 bg-teal-50'
              : 'border-slate-200 text-slate-600'
          } ${!hasSupplierScopedCategories ? 'cursor-not-allowed bg-slate-50 text-slate-400' : ''}`}
        >
          <option value="">{hasSupplierScopedCategories ? 'All Categories' : 'No categories assigned'}</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </div>

      {showBrandFilter && (
        <div className="relative shrink-0">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A4 4 0 019 16h6a4 4 0 013.879 1.804M15 11a3 3 0 10-6 0 3 3 0 006 0z"/>
          </svg>
          <select
            value={brandType ?? ''}
            onChange={e => onBrandType(e.target.value === '' ? undefined : Number(e.target.value))}
            className={`pl-9 pr-8 py-2.5 bg-white border rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 appearance-none cursor-pointer ${
              brandType !== undefined
                ? 'border-teal-400 text-teal-700 bg-teal-50'
                : 'border-slate-200 text-slate-600'
            }`}
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      )}

      {typeof onSupplierFilterId === 'function' && supplierOptions.length > 0 && (
        <div className="relative shrink-0">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5V4H2v16h5m10 0v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4m10 0H7m10-12h.01M7 8h6m-6 4h10" />
          </svg>
          <select
            value={supplierFilterId ?? ''}
            onChange={e => onSupplierFilterId(e.target.value === '' ? undefined : Number(e.target.value))}
            className={`pl-9 pr-8 py-2.5 bg-white border rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 appearance-none cursor-pointer ${
              supplierFilterId !== undefined
                ? 'border-teal-400 text-teal-700 bg-teal-50'
                : 'border-slate-200 text-slate-600'
            }`}
          >
            <option value="">All Suppliers</option>
            {supplierOptions.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>{supplier.label}</option>
            ))}
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      )}

      {/* Search */}
      <div className="relative flex-1 min-w-48">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search by name or SKU…"
          className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
        />
        {search && (
          <button
            onClick={() => onSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {/* Count */}
      <span className="text-xs bg-white border border-slate-200 px-3 py-2.5 rounded-xl font-medium shrink-0 whitespace-nowrap text-slate-500">
        <span className="font-bold text-slate-700">{resultCount.toLocaleString()}</span> results
      </span>
    </div>
  )
}
