'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Product, useUpdateProductMutation, CreateProductPayload } from '@/store/api/productsApi'

interface EditProductModalProps {
  product: Product | null
  onClose: () => void
}

interface FormState {
  pd_name: string
  pd_catid: string
  pd_description: string
  pd_price_srp: string
  pd_price_dp: string
  pd_qty: string
  pd_weight: string
  pd_psweight: string
  pd_pslenght: string
  pd_psheight: string
  pd_parent_sku: string
  pd_type: string
  pd_musthave: boolean
  pd_bestseller: boolean
  pd_salespromo: boolean
  pd_status: string
}

type Errors = Partial<Record<keyof FormState, string>>

export default function EditProductModal({ product, onClose }: EditProductModalProps) {
  const isOpen = product !== null

  const [form, setForm] = useState<FormState>({
    pd_name: '', pd_catid: '', pd_description: '', pd_price_srp: '',
    pd_price_dp: '', pd_qty: '', pd_weight: '', pd_psweight: '',
    pd_pslenght: '', pd_psheight: '', pd_parent_sku: '', pd_type: '0',
    pd_musthave: false, pd_bestseller: false, pd_salespromo: false, pd_status: '0',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState('')

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [imageError, setImageError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [updateProduct, { isLoading }] = useUpdateProductMutation()

  // Populate form when product changes
  useEffect(() => {
    if (!product) return
    setForm({
      pd_name: product.name ?? '',
      pd_catid: String(product.catid ?? ''),
      pd_description: '',
      pd_price_srp: String(product.priceSrp ?? ''),
      pd_price_dp: String(product.priceDp ?? ''),
      pd_qty: String(product.qty ?? ''),
      pd_weight: String(product.weight ?? ''),
      pd_psweight: '',
      pd_pslenght: '',
      pd_psheight: '',
      pd_parent_sku: product.sku ?? '',
      pd_type: String(product.type ?? 0),
      pd_musthave: product.musthave ?? false,
      pd_bestseller: product.bestseller ?? false,
      pd_salespromo: product.salespromo ?? false,
      pd_status: String(product.status ?? 0),
    })
    setImageFile(null)
    setImagePreview(null)
    setErrors({})
    setServerError('')
    setImageError('')
  }, [product])

  const set = (key: keyof FormState, value: string | boolean) => {
    setForm((p) => ({ ...p, [key]: value }))
    setErrors((p) => ({ ...p, [key]: undefined }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageError('')
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) { setImageError('Only JPEG, PNG, WEBP, or GIF allowed.'); return }
    if (file.size > 5 * 1024 * 1024) { setImageError('File too large. Max 5MB.'); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleRemoveNewImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setImageError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const validate = (): Errors => {
    const e: Errors = {}
    if (!form.pd_name.trim()) e.pd_name = 'Product name is required'
    if (!form.pd_catid.trim()) e.pd_catid = 'Category is required'
    if (!form.pd_price_srp.trim() || isNaN(Number(form.pd_price_srp))) e.pd_price_srp = 'Valid SRP price is required'
    return e
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!product) return
    setServerError('')
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    let finalImageUrl = product.image ?? undefined

    // Upload new image if selected
    if (imageFile) {
      setIsUploading(true)
      try {
        const fd = new FormData()
        fd.append('file', imageFile)
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? 'Upload failed')
        finalImageUrl = json.url
      } catch (err: unknown) {
        const ex = err as Error
        setImageError(ex.message ?? 'Image upload failed.')
        setIsUploading(false)
        return
      }
      setIsUploading(false)
    }

    const payload: Partial<CreateProductPayload> = {
      pd_name: form.pd_name.trim(),
      pd_catid: Number(form.pd_catid),
      pd_price_srp: Number(form.pd_price_srp),
      pd_price_dp: form.pd_price_dp ? Number(form.pd_price_dp) : undefined,
      pd_qty: form.pd_qty ? Number(form.pd_qty) : undefined,
      pd_weight: form.pd_weight ? Number(form.pd_weight) : undefined,
      pd_parent_sku: form.pd_parent_sku.trim() || undefined,
      pd_type: Number(form.pd_type),
      pd_musthave: form.pd_musthave,
      pd_bestseller: form.pd_bestseller,
      pd_salespromo: form.pd_salespromo,
      pd_status: Number(form.pd_status),
      pd_image: finalImageUrl,
    }

    try {
      await updateProduct({ id: product.id, data: payload }).unwrap()
      onClose()
    } catch (err: unknown) {
      const ex = err as { data?: { message?: string } }
      setServerError(ex?.data?.message ?? 'Failed to update product.')
    }
  }

  const handleClose = () => {
    if (isLoading || isUploading) return
    onClose()
  }

  const textField = (label: string, key: keyof FormState, type = 'text', placeholder = '', required = false) => (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={form[key] as string}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all
          ${errors[key] ? 'border-red-300 focus:ring-red-300/30 focus:border-red-400' : 'border-slate-200 focus:ring-teal-500/30 focus:border-teal-400'}`}
      />
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
    </div>
  )

  const isBusy = isLoading || isUploading
  const currentImage = imagePreview ?? product?.image ?? null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"/>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4"
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
                      <h2 className="text-slate-800 font-bold text-base leading-none">Edit Product</h2>
                      <p className="text-slate-400 text-xs mt-1">ID #{product?.id} · {product?.name}</p>
                    </div>
                  </div>
                  <button onClick={handleClose} disabled={isBusy}
                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center disabled:opacity-40">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                  {serverError && (
                    <div className="flex items-start gap-2.5 p-3 bg-red-50 rounded-xl border border-red-100">
                      <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      <p className="text-xs text-red-600">{serverError}</p>
                    </div>
                  )}

                  {/* Image */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Product Image</p>
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageChange} className="hidden" id="edit-product-image-input"/>

                    <div className="flex gap-3 items-start">
                      {/* Current / Preview */}
                      <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        {currentImage ? (
                          <Image src={currentImage} alt="Product" fill className="object-cover" unoptimized/>
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                          </div>
                        )}
                        {imagePreview && (
                          <div className="absolute top-1 right-1 bg-blue-500 text-white text-[9px] px-1 py-0.5 rounded font-bold">NEW</div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-xs text-slate-500">{imagePreview ? 'New image selected — will upload on save.' : 'Current image shown. Pick a new one to replace it.'}</p>
                        <div className="flex gap-2">
                          <label htmlFor="edit-product-image-input"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            Change Image
                          </label>
                          {imagePreview && (
                            <button type="button" onClick={handleRemoveNewImage}
                              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 rounded-lg text-xs font-semibold transition-colors">
                              Cancel
                            </button>
                          )}
                        </div>
                        {imageError && <p className="text-red-500 text-xs">{imageError}</p>}
                      </div>
                    </div>
                  </div>

                  {textField('Product Name', 'pd_name', 'text', '', true)}

                  <div className="grid grid-cols-2 gap-3">
                    {textField('Category ID', 'pd_catid', 'number', '', true)}
                    {textField('Parent SKU', 'pd_parent_sku', 'text', 'e.g. SOFA-001')}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {textField('SRP Price (₱)', 'pd_price_srp', 'number', '0.00', true)}
                    {textField('DP Price (₱)', 'pd_price_dp', 'number', '0.00')}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {textField('Quantity', 'pd_qty', 'number', '0')}
                    {textField('Weight (g)', 'pd_weight', 'number', '0')}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Product Type</label>
                      <select value={form.pd_type} onChange={(e) => set('pd_type', e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all cursor-pointer">
                        <option value="0">Regular</option>
                        <option value="1">Variant</option>
                        <option value="2">Bundle</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
                      <select value={form.pd_status} onChange={(e) => set('pd_status', e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all cursor-pointer">
                        <option value="0">Inactive (Draft)</option>
                        <option value="1">Active</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 px-3 py-3 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input type="checkbox" checked={form.pd_musthave} onChange={(e) => set('pd_musthave', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"/>
                      <span className="text-sm text-slate-700 font-medium">Must Have</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input type="checkbox" checked={form.pd_bestseller} onChange={(e) => set('pd_bestseller', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"/>
                      <span className="text-sm text-slate-700 font-medium">Best Seller</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input type="checkbox" checked={form.pd_salespromo} onChange={(e) => set('pd_salespromo', e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-rose-500 focus:ring-rose-400"/>
                      <span className="text-sm text-slate-700 font-medium">On Sale</span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button type="button" onClick={handleClose} disabled={isBusy}
                      className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60">
                      Cancel
                    </button>
                    <button type="submit" disabled={isBusy}
                      className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-60">
                      {isBusy ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          {isUploading ? 'Uploading...' : 'Saving...'}
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
