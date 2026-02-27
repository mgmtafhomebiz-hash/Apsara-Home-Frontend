'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCreateCategoryMutation, CreateCategoryPayload } from '@/store/api/categoriesApi'

interface Props {
  isOpen: boolean
  onClose: () => void
}

interface FormState {
  cat_name: string
  cat_description: string
  cat_url: string
  cat_order: string
}

const defaultForm: FormState = {
  cat_name: '',
  cat_description: '',
  cat_url: '',
  cat_order: '0',
}

type Errors = Partial<Record<keyof FormState, string>>

const toSlug = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')

export default function AddCategoryModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<FormState>(defaultForm)
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState('')
  const [slugLocked, setSlugLocked] = useState(false)

  const [createCategory, { isLoading }] = useCreateCategoryMutation()

  // Auto-generate slug from name unless user has manually edited it
  useEffect(() => {
    if (!slugLocked) {
      setForm((p) => ({ ...p, cat_url: toSlug(p.cat_name) }))
    }
  }, [form.cat_name, slugLocked])

  const set = (key: keyof FormState, value: string) => {
    setForm((p) => ({ ...p, [key]: value }))
    setErrors((p) => ({ ...p, [key]: undefined }))
  }

  const handleSlugChange = (value: string) => {
    setSlugLocked(true)
    set('cat_url', toSlug(value))
  }

  const validate = (): Errors => {
    const e: Errors = {}
    if (!form.cat_name.trim()) e.cat_name = 'Category name is required'
    if (form.cat_name.trim().length > 50) e.cat_name = 'Maximum 50 characters'
    if (form.cat_description.length > 200) e.cat_description = 'Maximum 200 characters'
    if (form.cat_url.length > 40) e.cat_url = 'Maximum 40 characters'
    if (form.cat_order && isNaN(Number(form.cat_order))) e.cat_order = 'Must be a number'
    return e
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setServerError('')
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const payload: CreateCategoryPayload = {
      cat_name: form.cat_name.trim(),
      cat_description: form.cat_description.trim() || undefined,
      cat_url: form.cat_url || toSlug(form.cat_name),
      cat_order: Number(form.cat_order) || 0,
    }

    try {
      await createCategory(payload).unwrap()
      handleClose()
    } catch (err: unknown) {
      const ex = err as { data?: { message?: string } }
      setServerError(ex?.data?.message ?? 'Failed to create category.')
    }
  }

  const handleClose = () => {
    if (isLoading) return
    setForm(defaultForm)
    setErrors({})
    setServerError('')
    setSlugLocked(false)
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
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-violet-500 flex items-center justify-center shadow-md shadow-violet-500/30">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-slate-800 font-bold text-base leading-none">Add Category</h2>
                      <p className="text-slate-400 text-xs mt-1">Create a new product category</p>
                    </div>
                  </div>
                  <button onClick={handleClose} disabled={isLoading}
                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center disabled:opacity-40">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                  {serverError && (
                    <div className="flex items-start gap-2.5 p-3 bg-red-50 rounded-xl border border-red-100">
                      <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <p className="text-xs text-red-600">{serverError}</p>
                    </div>
                  )}

                  {/* Category Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.cat_name}
                      onChange={(e) => set('cat_name', e.target.value)}
                      placeholder="e.g. Home Furniture"
                      maxLength={50}
                      className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all
                        ${errors.cat_name ? 'border-red-300 focus:ring-red-300/30 focus:border-red-400' : 'border-slate-200 focus:ring-violet-500/30 focus:border-violet-400'}`}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.cat_name ? <p className="text-red-500 text-xs">{errors.cat_name}</p> : <span/>}
                      <p className="text-slate-400 text-xs">{form.cat_name.length}/50</p>
                    </div>
                  </div>

                  {/* URL Slug */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">URL Slug</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono">/</span>
                      <input
                        type="text"
                        value={form.cat_url}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        placeholder="home-furniture"
                        maxLength={40}
                        className={`w-full pl-6 pr-3 py-2.5 bg-slate-50 border rounded-xl text-sm font-mono text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all
                          ${errors.cat_url ? 'border-red-300 focus:ring-red-300/30 focus:border-red-400' : 'border-slate-200 focus:ring-violet-500/30 focus:border-violet-400'}`}
                      />
                    </div>
                    <p className="text-slate-400 text-xs mt-1">Auto-generated from name · editable</p>
                    {errors.cat_url && <p className="text-red-500 text-xs mt-0.5">{errors.cat_url}</p>}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
                    <textarea
                      value={form.cat_description}
                      onChange={(e) => set('cat_description', e.target.value)}
                      placeholder="Short description of this category..."
                      rows={3}
                      maxLength={200}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all resize-none"
                    />
                    <div className="flex justify-between mt-1">
                      {errors.cat_description ? <p className="text-red-500 text-xs">{errors.cat_description}</p> : <span/>}
                      <p className="text-slate-400 text-xs">{form.cat_description.length}/200</p>
                    </div>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Sort Order</label>
                    <input
                      type="number"
                      value={form.cat_order}
                      onChange={(e) => set('cat_order', e.target.value)}
                      placeholder="0"
                      min="0"
                      className="w-32 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                    />
                    <p className="text-slate-400 text-xs mt-1">Lower number = appears first</p>
                    {errors.cat_order && <p className="text-red-500 text-xs mt-0.5">{errors.cat_order}</p>}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={handleClose} disabled={isLoading}
                      className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60">
                      Cancel
                    </button>
                    <button type="submit" disabled={isLoading}
                      className="flex-1 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-violet-500/30 flex items-center justify-center gap-2 disabled:opacity-60">
                      {isLoading ? (
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                          </svg>
                          Add Category
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
