'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGetCategoriesQuery } from '@/store/api/categoriesApi'
import { Product, useUpdateProductMutation, CreateProductPayload } from '@/store/api/productsApi'

interface Props {
  products: Product[]
  onClose: () => void
  onSaved?: () => void
}

type ToggleMode = 'unchanged' | 'enabled' | 'disabled'

const toggleToBoolean = (value: ToggleMode): boolean | undefined => {
  if (value === 'enabled') return true
  if (value === 'disabled') return false
  return undefined
}

export default function BulkEditProductsModal({ products, onClose, onSaved }: Props) {
  const isOpen = products.length > 0
  const { data: categoriesData } = useGetCategoriesQuery({ page: 1, per_page: 500 })
  const [updateProduct] = useUpdateProductMutation()

  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState('')
  const [mustHave, setMustHave] = useState<ToggleMode>('unchanged')
  const [bestSeller, setBestSeller] = useState<ToggleMode>('unchanged')
  const [salesPromo, setSalesPromo] = useState<ToggleMode>('unchanged')
  const [verified, setVerified] = useState<ToggleMode>('unchanged')
  const [isSaving, setIsSaving] = useState(false)
  const [serverError, setServerError] = useState('')

  const categories = categoriesData?.categories ?? []

  const patch = useMemo(() => {
    const nextPatch: Partial<CreateProductPayload> = {}

    if (categoryId !== '') nextPatch.pd_catid = Number(categoryId)
    if (status !== '') nextPatch.pd_status = Number(status)

    const mustHaveValue = toggleToBoolean(mustHave)
    const bestSellerValue = toggleToBoolean(bestSeller)
    const salesPromoValue = toggleToBoolean(salesPromo)
    const verifiedValue = toggleToBoolean(verified)

    if (mustHaveValue !== undefined) nextPatch.pd_musthave = mustHaveValue
    if (bestSellerValue !== undefined) nextPatch.pd_bestseller = bestSellerValue
    if (salesPromoValue !== undefined) nextPatch.pd_salespromo = salesPromoValue
    if (verifiedValue !== undefined) nextPatch.pd_verified = verifiedValue

    return nextPatch
  }, [bestSeller, categoryId, mustHave, salesPromo, status, verified])

  const patchKeys = Object.keys(patch)

  const handleClose = () => {
    if (isSaving) return
    onClose()
  }

  const handleSave = async () => {
    if (patchKeys.length === 0) {
      onClose()
      return
    }

    setIsSaving(true)
    setServerError('')

    try {
      await Promise.all(
        products.map((product) =>
          updateProduct({
            id: product.id,
            data: patch,
          }).unwrap(),
        ),
      )

      onSaved?.()
      onClose()
    } catch {
      setServerError('Some products failed to update. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 text-white shadow-md shadow-teal-500/25">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h10" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-800">Bulk Edit Products</h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Apply the same changes to <span className="font-semibold text-slate-700">{products.length}</span> selected product{products.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={isSaving}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-5 px-6 py-5">
                  {serverError && (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {serverError}
                    </div>
                  )}

                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Selected products</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {products.map((product) => (
                        <span
                          key={product.id}
                          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600"
                        >
                          <span className="font-semibold text-slate-800">#{product.id}</span>
                          <span className="max-w-40 truncate">{product.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-600">Category</span>
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
                      >
                        <option value="">No change</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-xs font-semibold text-slate-600">Status</span>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
                      >
                        <option value="">No change</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                    </label>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <ToggleField label="Must Have" value={mustHave} onChange={setMustHave} />
                    <ToggleField label="Bestseller" value={bestSeller} onChange={setBestSeller} />
                    <ToggleField label="Sales Promo" value={salesPromo} onChange={setSalesPromo} />
                    <ToggleField label="Verified" value={verified} onChange={setVerified} />
                  </div>

                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                    Only the fields you change here will be applied. Leaving a field as <span className="font-semibold">No change</span> keeps the current value of each selected product.
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
                  <p className="text-xs text-slate-400">
                    {patchKeys.length > 0 ? `${patchKeys.length} field${patchKeys.length !== 1 ? 's' : ''} ready to apply` : 'No changes selected yet'}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleClose}
                      disabled={isSaving}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:opacity-60"
                    >
                      {isSaving ? 'Saving…' : 'Apply Bulk Edit'}
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

function ToggleField({
  label,
  value,
  onChange,
}: {
  label: string
  value: ToggleMode
  onChange: (value: ToggleMode) => void
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ToggleMode)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
      >
        <option value="unchanged">No change</option>
        <option value="enabled">Enable</option>
        <option value="disabled">Disable</option>
      </select>
    </label>
  )
}
