'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Category, useUpdateCategoryMutation, CreateCategoryPayload } from '@/store/api/categoriesApi'

interface Props {
  category: Category | null
  onClose: () => void
}

interface FormState {
  cat_name: string
  cat_description: string
  cat_url: string
  cat_order: string
}

type Errors = Partial<Record<keyof FormState, string>>

const toSlug = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')

export default function EditCategoryModal({ category, onClose }: Props) {
  const isOpen = category !== null

  const [form, setForm] = useState<FormState>({
    cat_name: '', cat_description: '', cat_url: '', cat_order: '0',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState('')
  const [slugManual, setSlugManual] = useState(false)

  const [updateCategory, { isLoading }] = useUpdateCategoryMutation()

  useEffect(() => {
    if (!category) return
    setForm({
      cat_name:        category.name ?? '',
      cat_description: category.description ?? '',
      cat_url:         category.url ?? '',
      cat_order:       String(category.order ?? 0),
    })
    setSlugManual(true) // pre-filled slug = keep it
    setErrors({})
    setServerError('')
  }, [category])

  const set = (key: keyof FormState, value: string) => {
    setForm((p) => ({ ...p, [key]: value }))
    setErrors((p) => ({ ...p, [key]: undefined }))
  }

  const handleSlugChange = (value: string) => {
    setSlugManual(true)
    set('cat_url', toSlug(value))
  }

  const validate = (): Errors => {
    const e: Errors = {}
    if (!form.cat_name.trim()) e.cat_name = 'Category name is required'
    if (form.cat_name.trim().length > 50) e.cat_name = 'Maximum 50 characters'
    if (form.cat_description.length > 200) e.cat_description = 'Maximum 200 characters'
    if (form.cat_url.length > 40) e.cat_url = 'Maximum 40 characters'
    return e
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!category) return
    setServerError('')
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const payload: Partial<CreateCategoryPayload> = {
      cat_name:        form.cat_name.trim(),
      cat_description: form.cat_description.trim(),
      cat_url:         form.cat_url || toSlug(form.cat_name),
      cat_order:       Number(form.cat_order) || 0,
    }

    try {
      await updateCategory({ id: category.id, data: payload }).unwrap()
      onClose()
    } catch (err: unknown) {
      const ex = err as { data?: { message?: string } }
      setServerError(ex?.data?.message ?? 'Failed to update category.')
    }
  }

  const handleClose = () => {
    if (isLoading) return
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
                    <div className="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-md shadow-blue-500/30">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-slate-800 font-bold text-base leading-none">Edit Category</h2>
                      <p className="text-slate-400 text-xs mt-1">ID #{category?.id} · {category?.name}</p>
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

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.cat_name}
                      onChange={(e) => set('cat_name', e.target.value)}
                      maxLength={50}
                      className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all
                        ${errors.cat_name ? 'border-red-300 focus:ring-red-300/30 focus:border-red-400' : 'border-slate-200 focus:ring-blue-500/30 focus:border-blue-400'}`}
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
                        maxLength={40}
                        className="w-full pl-6 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                      />
                    </div>
                    {errors.cat_url && <p className="text-red-500 text-xs mt-1">{errors.cat_url}</p>}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
                    <textarea
                      value={form.cat_description}
                      onChange={(e) => set('cat_description', e.target.value)}
                      rows={3}
                      maxLength={200}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none"
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
                      min="0"
                      className="w-32 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                    />
                    <p className="text-slate-400 text-xs mt-1">Lower number = appears first</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={handleClose} disabled={isLoading}
                      className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60">
                      Cancel
                    </button>
                    <button type="submit" disabled={isLoading}
                      className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-60">
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                          </svg>
                          Save Changes
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
