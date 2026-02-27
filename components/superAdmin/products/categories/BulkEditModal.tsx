'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Category, useUpdateCategoryMutation } from '@/store/api/categoriesApi'

interface Props {
  categories: Category[]
  onClose: () => void
}

interface EditRow {
  id: number
  cat_name: string
  cat_url: string
  cat_order: string
  cat_description: string
}

type RowStatus = 'idle' | 'saving' | 'saved' | 'error'

const CARD_COLORS = [
  'bg-violet-500', 'bg-teal-500', 'bg-blue-500', 'bg-amber-500',
  'bg-rose-500', 'bg-emerald-500', 'bg-orange-500', 'bg-sky-500',
]

const toSlug = (v: string) =>
  v.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')

export default function BulkEditModal({ categories, onClose }: Props) {
  const isOpen = categories.length > 0

  const [rows, setRows]           = useState<EditRow[]>([])
  const [statuses, setStatuses]   = useState<Record<number, RowStatus>>({})
  const [isSavingAll, setIsSavingAll] = useState(false)
  const [serverError, setServerError] = useState('')

  const [updateCategory] = useUpdateCategoryMutation()

  // Initialise rows when categories change
  useEffect(() => {
    setRows(categories.map(c => ({
      id:              c.id,
      cat_name:        c.name,
      cat_url:         c.url !== '0' ? c.url : '',
      cat_order:       String(c.order),
      cat_description: c.description,
    })))
    setStatuses(Object.fromEntries(categories.map(c => [c.id, 'idle'])))
    setServerError('')
  }, [categories])

  const updateRow = (id: number, field: keyof Omit<EditRow, 'id'>, value: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
    setStatuses(prev => ({ ...prev, [id]: 'idle' }))
  }

  const handleUrlChange = (id: number, value: string) =>
    updateRow(id, 'cat_url', toSlug(value))

  // Detect which rows were changed vs originals
  const getChangedRows = () => {
    const origMap = Object.fromEntries(categories.map(c => [c.id, c]))
    return rows.filter(r => {
      const o = origMap[r.id]
      if (!o) return false
      return (
        r.cat_name.trim()        !== o.name ||
        r.cat_url                !== (o.url !== '0' ? o.url : '') ||
        r.cat_description.trim() !== o.description ||
        Number(r.cat_order)      !== o.order
      )
    })
  }

  const changedRows = getChangedRows()

  const handleSaveAll = async () => {
    if (changedRows.length === 0) { onClose(); return }
    setIsSavingAll(true)
    setServerError('')
    let hasError = false

    for (const row of changedRows) {
      setStatuses(prev => ({ ...prev, [row.id]: 'saving' }))
      try {
        await updateCategory({
          id: row.id,
          data: {
            cat_name:        row.cat_name.trim(),
            cat_description: row.cat_description.trim(),
            cat_url:         row.cat_url || toSlug(row.cat_name),
            cat_order:       Number(row.cat_order) || 0,
          },
        }).unwrap()
        setStatuses(prev => ({ ...prev, [row.id]: 'saved' }))
      } catch {
        setStatuses(prev => ({ ...prev, [row.id]: 'error' }))
        hasError = true
      }
    }

    setIsSavingAll(false)
    if (!hasError) {
      onClose()
    } else {
      setServerError('Some categories failed to save. Check the rows marked in red.')
    }
  }

  const handleClose = () => {
    if (isSavingAll) return
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-md shadow-teal-500/30 shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-slate-800 font-bold text-base leading-none">Bulk Edit</h2>
                      <p className="text-slate-400 text-xs mt-1">
                        Editing <span className="font-semibold text-slate-600">{categories.length}</span> categories
                        {changedRows.length > 0 && (
                          <span className="ml-1.5 text-teal-600 font-semibold">· {changedRows.length} changed</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <button onClick={handleClose} disabled={isSavingAll}
                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center disabled:opacity-40">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                {/* Error banner */}
                <AnimatePresence>
                  {serverError && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mx-6 mt-4 flex items-start gap-2.5 p-3 bg-red-50 rounded-xl border border-red-100">
                      <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <p className="text-xs text-red-600">{serverError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Column headers */}
                <div className="px-6 pt-4">
                  <div className="grid grid-cols-[32px_1fr_1fr_72px_1fr] gap-2 pb-1.5 border-b border-slate-100">
                    <div/>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Name</p>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">URL Slug</p>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide text-center">Order</p>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Description</p>
                  </div>
                </div>

                {/* Rows */}
                <div className="px-6 py-3 space-y-2 max-h-[50vh] overflow-y-auto">
                  {rows.map((row, idx) => {
                    const status  = statuses[row.id] ?? 'idle'
                    const color   = CARD_COLORS[idx % CARD_COLORS.length]
                    const origCat = categories.find(c => c.id === row.id)
                    const changed = origCat && (
                      row.cat_name.trim()        !== origCat.name ||
                      row.cat_url                !== (origCat.url !== '0' ? origCat.url : '') ||
                      row.cat_description.trim() !== origCat.description ||
                      Number(row.cat_order)      !== origCat.order
                    )

                    return (
                      <div key={row.id}
                        className={`grid grid-cols-[32px_1fr_1fr_72px_1fr] gap-2 items-center py-2 px-2 rounded-xl transition-colors
                          ${status === 'saved'  ? 'bg-teal-50/70'  : ''}
                          ${status === 'error'  ? 'bg-red-50/70'   : ''}
                          ${status === 'saving' ? 'bg-slate-50/70' : ''}
                          ${changed && status === 'idle' ? 'bg-amber-50/60' : ''}
                        `}
                      >
                        {/* Color initial icon */}
                        <div className={`h-7 w-7 rounded-lg ${color} flex items-center justify-center shrink-0`}>
                          <span className="text-white text-xs font-bold uppercase">{row.cat_name.charAt(0) || '?'}</span>
                        </div>

                        {/* Name */}
                        <input
                          type="text"
                          value={row.cat_name}
                          onChange={(e) => updateRow(row.id, 'cat_name', e.target.value)}
                          maxLength={50}
                          disabled={status === 'saving'}
                          placeholder="Category name"
                          className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all disabled:opacity-60 w-full"
                        />

                        {/* URL Slug */}
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">/</span>
                          <input
                            type="text"
                            value={row.cat_url}
                            onChange={(e) => handleUrlChange(row.id, e.target.value)}
                            maxLength={40}
                            disabled={status === 'saving'}
                            placeholder="url-slug"
                            className="pl-4 pr-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all disabled:opacity-60 w-full"
                          />
                        </div>

                        {/* Order */}
                        <input
                          type="number"
                          value={row.cat_order}
                          onChange={(e) => updateRow(row.id, 'cat_order', e.target.value)}
                          min="0"
                          disabled={status === 'saving'}
                          className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 text-center focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all disabled:opacity-60 w-full"
                        />

                        {/* Description */}
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={row.cat_description}
                            onChange={(e) => updateRow(row.id, 'cat_description', e.target.value)}
                            maxLength={200}
                            disabled={status === 'saving'}
                            placeholder="Description..."
                            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all disabled:opacity-60 w-full"
                          />
                          {/* Row status indicator */}
                          <div className="shrink-0 w-5">
                            {status === 'saving' && (
                              <svg className="w-4 h-4 text-slate-400 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                              </svg>
                            )}
                            {status === 'saved' && (
                              <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                              </svg>
                            )}
                            {status === 'error' && (
                              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-400">
                    {changedRows.length === 0
                      ? 'No changes yet — edit any field above'
                      : <span className="text-amber-600 font-semibold">{changedRows.length} unsaved change{changedRows.length !== 1 ? 's' : ''}</span>
                    }
                  </p>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleClose} disabled={isSavingAll}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60">
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAll}
                      disabled={isSavingAll || changedRows.length === 0}
                      className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-teal-500/30 disabled:opacity-60"
                    >
                      {isSavingAll ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                          </svg>
                          Save {changedRows.length > 0 ? changedRows.length : ''} Change{changedRows.length !== 1 ? 's' : ''}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
