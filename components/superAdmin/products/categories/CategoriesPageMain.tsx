'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { Category, useGetCategoriesQuery, useDeleteCategoryMutation } from '@/store/api/categoriesApi'
import AddCategoryModal from './AddCategoryModal'
import EditCategoryModal from './EditCategoryModal'
import BulkEditModal from './BulkEditModal'

const CARD_COLORS = [
  { bg: 'bg-violet-500',  text: 'text-violet-700',  badge: 'bg-violet-100 text-violet-700',  check: 'accent-violet-600' },
  { bg: 'bg-teal-500',    text: 'text-teal-700',    badge: 'bg-teal-100 text-teal-700',      check: 'accent-teal-600' },
  { bg: 'bg-blue-500',    text: 'text-blue-700',    badge: 'bg-blue-100 text-blue-700',      check: 'accent-blue-600' },
  { bg: 'bg-amber-500',   text: 'text-amber-700',   badge: 'bg-amber-100 text-amber-700',    check: 'accent-amber-600' },
  { bg: 'bg-rose-500',    text: 'text-rose-700',    badge: 'bg-rose-100 text-rose-700',      check: 'accent-rose-600' },
  { bg: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700',check: 'accent-emerald-600' },
  { bg: 'bg-orange-500',  text: 'text-orange-700',  badge: 'bg-orange-100 text-orange-700',  check: 'accent-orange-600' },
  { bg: 'bg-sky-500',     text: 'text-sky-700',     badge: 'bg-sky-100 text-sky-700',        check: 'accent-sky-600' },
]

type SortKey = 'order-asc' | 'order-desc' | 'name-asc' | 'name-desc' | 'newest' | 'oldest'

function CategoryCard({
  category, colorIndex, onEdit, onDelete, isDeleting,
  isSelected, onToggleSelect, anySelected,
}: {
  category: Category
  colorIndex: number
  onEdit: (c: Category) => void
  onDelete: (id: number) => void
  isDeleting: Set<number>
  isSelected: boolean
  onToggleSelect: (id: number) => void
  anySelected: boolean
}) {
  const [confirming, setConfirming] = useState(false)
  const color = CARD_COLORS[colorIndex % CARD_COLORS.length]
  const isThisDeleting = isDeleting.has(category.id)

  const handleDeleteClick = () => setConfirming(true)
  const handleConfirm = () => { onDelete(category.id); setConfirming(false) }
  const handleCancel  = () => setConfirming(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group relative bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden
        ${isSelected ? 'border-violet-400 ring-2 ring-violet-300/50' : 'border-slate-100 hover:border-slate-200'}`}
    >
      {/* Checkbox overlay */}
      <div
        onClick={() => onToggleSelect(category.id)}
        className={`absolute top-3 left-3 z-10 transition-opacity duration-150 cursor-pointer
          ${anySelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      >
        <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all
          ${isSelected ? 'bg-violet-600 border-violet-600' : 'bg-white border-slate-300 hover:border-violet-400'}`}>
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
            </svg>
          )}
        </div>
      </div>

      <div className={`p-5 transition-all ${anySelected ? 'pl-11' : ''}`}>
        <div className="flex items-start gap-4">
          {/* Icon block */}
          <div className={`h-12 w-12 rounded-xl ${color.bg} flex items-center justify-center shrink-0 shadow-sm`}>
            <span className="text-white font-bold text-lg uppercase">{category.name.charAt(0)}</span>
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-800 text-sm leading-tight">{category.name}</h3>
              <span className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md ${color.badge}`}>
                #{category.order}
              </span>
            </div>
            {category.url && category.url !== '0' && (
              <p className={`text-xs font-mono mt-1 ${color.text} opacity-80`}>/{category.url}</p>
            )}
            {category.description ? (
              <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">{category.description}</p>
            ) : (
              <p className="text-slate-300 text-xs mt-2 italic">No description</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/60 flex items-center justify-between">
        <span className="text-slate-400 text-xs">ID #{category.id}</span>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {/* Edit — hide while confirming */}
          {!confirming && (
            <button
              onClick={() => onEdit(category)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Edit
            </button>
          )}

          <AnimatePresence mode="wait">
            {confirming ? (
              // Confirm + Cancel side-by-side
              <motion.div key="confirm-row"
                initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.12 }}
                className="flex items-center gap-1"
              >
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isThisDeleting}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-60"
                >
                  {isThisDeleting ? (
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  )}
                  Delete
                </button>
              </motion.div>
            ) : (
              // Initial delete button
              <motion.button key="delete-btn"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.12 }}
                onClick={handleDeleteClick}
                disabled={isThisDeleting}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-60"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Delete
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

function sortCategories(list: Category[], sort: SortKey): Category[] {
  return [...list].sort((a, b) => {
    switch (sort) {
      case 'order-asc':  return a.order - b.order || a.id - b.id
      case 'order-desc': return b.order - a.order || b.id - a.id
      case 'name-asc':   return a.name.localeCompare(b.name)
      case 'name-desc':  return b.name.localeCompare(a.name)
      case 'newest':     return b.id - a.id
      case 'oldest':     return a.id - b.id
      default:           return 0
    }
  })
}

export default function CategoriesPageMain() {
  const { data: session, status: authStatus } = useSession()
  const [search, setSearch]               = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sort, setSort]                   = useState<SortKey>('order-asc')
  const [showAddModal, setShowAddModal]   = useState(false)
  const [editCategory, setEditCategory]   = useState<Category | null>(null)
  const [deletingIds, setDeletingIds]       = useState<Set<number>>(new Set())
  const [selectedIds, setSelectedIds]       = useState<Set<number>>(new Set())
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [showBulkEdit, setShowBulkEdit]     = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => clearTimeout(t)
  }, [search])

  const hasToken = Boolean(session?.user?.accessToken)
  const skip = authStatus !== 'authenticated' || !hasToken

  const { data, isLoading, isFetching, isError } = useGetCategoriesQuery(
    { search: debouncedSearch || undefined },
    { skip },
  )

  const [deleteCategory] = useDeleteCategoryMutation()

  const rawCategories = data?.categories ?? []
  const total         = data?.total ?? 0

  const categories = useMemo(() => sortCategories(rawCategories, sort), [rawCategories, sort])

  // — single delete —
  const handleDelete = async (id: number) => {
    setDeletingIds(prev => new Set(prev).add(id))
    try { await deleteCategory(id).unwrap() } catch { /* silent */ }
    finally { setDeletingIds(prev => { const n = new Set(prev); n.delete(id); return n }) }
  }

  // — multi-select —
  const toggleSelect = (id: number) =>
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  const allVisible   = categories.length > 0 && categories.every(c => selectedIds.has(c.id))
  const someSelected = selectedIds.size > 0
  const toggleSelectAll = () =>
    setSelectedIds(allVisible ? new Set() : new Set(categories.map(c => c.id)))

  const clearSelection = () => setSelectedIds(new Set())

  // — bulk delete —
  const handleBulkDelete = async () => {
    if (!someSelected) return
    setIsBulkDeleting(true)
    const ids = Array.from(selectedIds)
    for (const id of ids) {
      setDeletingIds(prev => new Set(prev).add(id))
      try { await deleteCategory(id).unwrap() } catch { /* silent */ }
      finally { setDeletingIds(prev => { const n = new Set(prev); n.delete(id); return n }) }
    }
    setSelectedIds(new Set())
    setIsBulkDeleting(false)
  }

  const sortLabel: Record<SortKey, string> = {
    'order-asc':  'Order ↑',
    'order-desc': 'Order ↓',
    'name-asc':   'Name A→Z',
    'name-desc':  'Name Z→A',
    'newest':     'Newest',
    'oldest':     'Oldest',
  }

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/admin/products" className="hover:text-slate-600 transition-colors">Products</Link>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
        </svg>
        <span className="text-slate-600 font-medium">Categories</span>
      </motion.div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Product Categories</h1>
          <p className="text-sm text-slate-500 mt-0.5">Organize your products into categories</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-violet-500/30 shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          <span className="hidden sm:inline">Add Category</span>
        </button>
      </motion.div>

      {/* Stats strip */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-slate-100 px-5 py-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 leading-none">{isLoading ? '—' : total}</p>
            <p className="text-xs text-slate-500 mt-0.5">Total Categories</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 px-5 py-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 leading-none">
              {isLoading ? '—' : rawCategories.filter(c => c.description).length}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">With Description</p>
          </div>
        </div>

        <div className="hidden sm:flex bg-white rounded-2xl border border-slate-100 px-5 py-4 items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 leading-none">
              {isLoading ? '—' : rawCategories.filter(c => c.url && c.url !== '0').length}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">With URL Slug</p>
          </div>
        </div>
      </motion.div>

      {/* Toolbar: search + sort + select-all */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-3">

        {/* Select-all checkbox */}
        {!isLoading && categories.length > 0 && (
          <button
            onClick={toggleSelectAll}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all
              ${allVisible
                ? 'bg-violet-50 border-violet-300 text-violet-700'
                : 'bg-white border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600'}`}
          >
            <div className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-all shrink-0
              ${allVisible ? 'bg-violet-600 border-violet-600' : 'border-slate-300'}`}>
              {allVisible && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                </svg>
              )}
            </div>
            {allVisible ? 'Deselect All' : 'Select All'}
          </button>
        )}

        {/* Search */}
        <div className="relative flex-1 min-w-45 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
          </svg>
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="appearance-none pl-3 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all cursor-pointer font-medium"
          >
            <option value="order-asc">Order ↑</option>
            <option value="order-desc">Order ↓</option>
            <option value="name-asc">Name A→Z</option>
            <option value="name-desc">Name Z→A</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </div>

        {/* Count */}
        {!isLoading && (
          <p className="text-sm text-slate-500 shrink-0 ml-auto">
            {debouncedSearch
              ? <><span className="font-semibold text-slate-700">{categories.length}</span> result{categories.length !== 1 ? 's' : ''}</>
              : <><span className="font-semibold text-slate-700">{total}</span> total</>
            }
          </p>
        )}
      </motion.div>

      {/* Fetching indicator */}
      {isFetching && !isLoading && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-violet-500"/>
        </div>
      )}

      {/* Bulk delete bar */}
      <AnimatePresence>
        {someSelected && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
            className="flex items-center gap-3 px-4 py-3 bg-violet-50 border border-violet-200 rounded-2xl"
          >
            <div className="h-7 w-7 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <p className="text-sm font-semibold text-violet-800 flex-1">
              <span className="text-violet-600">{selectedIds.size}</span> categor{selectedIds.size === 1 ? 'y' : 'ies'} selected
            </p>
            <button onClick={clearSelection}
              className="px-3 py-1.5 text-xs font-semibold text-violet-600 hover:bg-violet-100 rounded-lg transition-colors">
              Clear
            </button>
            <button
              onClick={() => setShowBulkEdit(true)}
              disabled={isBulkDeleting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Edit {selectedIds.size}
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-60"
            >
              {isBulkDeleting ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  Delete {selectedIds.size}
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {authStatus === 'loading' ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Loading your session...</div>
      ) : authStatus === 'unauthenticated' ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Please sign in to load categories.</div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Failed to load categories. Please try again.</div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-200 shrink-0"/>
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 rounded bg-slate-200 w-3/4"/>
                  <div className="h-2.5 rounded bg-slate-100 w-1/3"/>
                  <div className="h-2.5 rounded bg-slate-100 w-full"/>
                  <div className="h-2.5 rounded bg-slate-100 w-2/3"/>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-50 h-8 bg-slate-50 rounded"/>
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
          </div>
          <p className="text-slate-600 font-semibold">
            {debouncedSearch ? `No categories matching "${debouncedSearch}"` : 'No categories yet'}
          </p>
          <p className="text-slate-400 text-sm mt-1">
            {debouncedSearch ? 'Try a different search term.' : 'Click "Add Category" to create your first one.'}
          </p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, idx) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                colorIndex={idx}
                onEdit={setEditCategory}
                onDelete={handleDelete}
                isDeleting={deletingIds}
                isSelected={selectedIds.has(cat.id)}
                onToggleSelect={toggleSelect}
                anySelected={someSelected}
              />
            ))}
          </div>
        </AnimatePresence>
      )}

      <AddCategoryModal isOpen={showAddModal} onClose={() => setShowAddModal(false)}/>
      <EditCategoryModal category={editCategory} onClose={() => setEditCategory(null)}/>
      <BulkEditModal
        categories={showBulkEdit ? categories.filter(c => selectedIds.has(c.id)) : []}
        onClose={() => { setShowBulkEdit(false); setSelectedIds(new Set()) }}
      />
    </div>
  )
}
