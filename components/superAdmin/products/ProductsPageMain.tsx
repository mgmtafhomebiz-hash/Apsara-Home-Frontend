'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { Product, useGetProductsQuery, useDeleteProductMutation } from '@/store/api/productsApi'
import ProductsToolbar from './ProductsToolbar'
import ProductsTable from './ProductsTable'
import AddProductModal from './AddProductModal'
import EditProductModal from './EditProductModal'

export default function ProductsPageMain() {
  const { data: session, status: authStatus } = useSession()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const perPage = 25

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => clearTimeout(t)
  }, [search])

  const hasToken = Boolean(session?.user?.accessToken)
  const skip = authStatus !== 'authenticated' || !hasToken

  const { data, isLoading, isFetching, isError } = useGetProductsQuery(
    { page, perPage, search: debouncedSearch || undefined, status: status || undefined },
    { skip },
  )

  const [deleteProduct] = useDeleteProductMutation()

  const products = data?.products ?? []
  const meta = data?.meta

  const handleSearch = (v: string) => { setSearch(v); setPage(1) }
  const handleStatus = (v: string) => { setStatus(v); setPage(1) }

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await deleteProduct(id).unwrap()
    } catch {
      // error handled silently — table will not change
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Products</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your product catalog</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-teal-500/30 shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          <span className="hidden sm:inline">Add Product</span>
        </button>
      </motion.div>

      {/* Toolbar */}
      <ProductsToolbar
        search={search} onSearch={handleSearch}
        status={status} onStatus={handleStatus}
        resultCount={meta?.total ?? products.length}
      />

      {/* Content */}
      {authStatus === 'loading' ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">Loading your session...</div>
      ) : authStatus === 'unauthenticated' ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Please sign in first to load products.</div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">Failed to load products. Please try again.</div>
      ) : isLoading && !data ? (
        <div className="space-y-4 animate-pulse">
          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <div className="grid grid-cols-9 gap-3 mb-3">
              {Array.from({ length: 9 }).map((_, i) => <div key={i} className="h-3 rounded bg-slate-200"/>)}
            </div>
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, ri) => (
                <div key={ri} className="grid grid-cols-9 gap-3">
                  {Array.from({ length: 9 }).map((_, ci) => <div key={ci} className="h-8 rounded bg-slate-100"/>)}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {isFetching && (
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-1/3 animate-pulse rounded-full bg-teal-500"/>
            </div>
          )}
          <ProductsTable
            rows={products}
            currentPage={meta?.current_page ?? 1}
            totalPages={meta?.last_page ?? 1}
            totalRecords={meta?.total ?? products.length}
            from={meta?.from ?? null}
            to={meta?.to ?? null}
            onPageChange={setPage}
            onEdit={setEditProduct}
            onDelete={handleDelete}
            isDeleting={deletingId}
          />
        </div>
      )}

      <AddProductModal isOpen={showAddModal} onClose={() => setShowAddModal(false)}/>
      <EditProductModal product={editProduct} onClose={() => setEditProduct(null)}/>
    </div>
  )
}
