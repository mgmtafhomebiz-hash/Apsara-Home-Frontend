'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useCreateProductMutation, CreateProductPayload } from '@/store/api/productsApi'

interface AddProductModalProps {
  isOpen: boolean
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

const defaultForm: FormState = {
  pd_name: '',
  pd_catid: '',
  pd_description: '',
  pd_price_srp: '',
  pd_price_dp: '',
  pd_qty: '',
  pd_weight: '',
  pd_psweight: '',
  pd_pslenght: '',
  pd_psheight: '',
  pd_parent_sku: '',
  pd_type: '0',
  pd_musthave: false,
  pd_bestseller: false,
  pd_salespromo: false,
  pd_status: '0',
}

type Errors = Partial<Record<keyof FormState, string>>

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [form, setForm] = useState<FormState>(defaultForm)
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState('')

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [imageError, setImageError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [createProduct, { isLoading }] = useCreateProductMutation()

  const set = (key: keyof FormState, value: string | boolean) => {
    setForm((p) => ({ ...p, [key]: value }))
    setErrors((p) => ({ ...p, [key]: undefined }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageError('')
    setUploadedUrl(null)

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      setImageError('Only JPEG, PNG, WEBP, or GIF files are allowed.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError('File too large. Maximum size is 5MB.')
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setUploadedUrl(null)
    setImageError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const validate = (): Errors => {
    const e: Errors = {}
    if (!form.pd_name.trim()) e.pd_name = 'Product name is required'
    if (!form.pd_catid.trim()) e.pd_catid = 'Category is required'
    if (!form.pd_price_srp.trim() || isNaN(Number(form.pd_price_srp))) e.pd_price_srp = 'Valid SRP price is required'
    if (form.pd_price_dp && isNaN(Number(form.pd_price_dp))) e.pd_price_dp = 'Must be a valid number'
    if (form.pd_qty && isNaN(Number(form.pd_qty))) e.pd_qty = 'Must be a valid number'
    if (form.pd_weight && isNaN(Number(form.pd_weight))) e.pd_weight = 'Must be a valid number'
    return e
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setServerError('')
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    // If image chosen but not yet uploaded, upload first
    let finalImageUrl = uploadedUrl
    if (imageFile && !uploadedUrl) {
      setIsUploading(true)
      try {
        const fd = new FormData()
        fd.append('file', imageFile)
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? 'Upload failed')
        finalImageUrl = json.url
        setUploadedUrl(json.url)
      } catch (err: unknown) {
        const ex = err as Error
        setImageError(ex.message ?? 'Image upload failed.')
        setIsUploading(false)
        return
      }
      setIsUploading(false)
    }

    const payload: CreateProductPayload = {
      pd_name: form.pd_name.trim(),
      pd_catid: Number(form.pd_catid),
      pd_price_srp: Number(form.pd_price_srp),
      pd_description: form.pd_description.trim() || undefined,
      pd_price_dp: form.pd_price_dp ? Number(form.pd_price_dp) : undefined,
      pd_qty: form.pd_qty ? Number(form.pd_qty) : undefined,
      pd_weight: form.pd_weight ? Number(form.pd_weight) : undefined,
      pd_psweight: form.pd_psweight ? Number(form.pd_psweight) : undefined,
      pd_pslenght: form.pd_pslenght ? Number(form.pd_pslenght) : undefined,
      pd_psheight: form.pd_psheight ? Number(form.pd_psheight) : undefined,
      pd_parent_sku: form.pd_parent_sku.trim() || undefined,
      pd_type: Number(form.pd_type),
      pd_musthave: form.pd_musthave,
      pd_bestseller: form.pd_bestseller,
      pd_salespromo: form.pd_salespromo,
      pd_status: Number(form.pd_status),
      pd_image: finalImageUrl ?? undefined,
    }

    try {
      await createProduct(payload).unwrap()
      handleClose()
    } catch (err: unknown) {
      const ex = err as { data?: { message?: string } }
      setServerError(ex?.data?.message ?? 'Failed to create product. Please try again.')
    }
  }

  const handleClose = () => {
    if (isLoading || isUploading) return
    setForm(defaultForm)
    setErrors({})
    setServerError('')
    handleRemoveImage()
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-md shadow-teal-500/30">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-slate-800 font-bold text-base leading-none">Add New Product</h2>
                    <p className="text-slate-400 text-xs mt-1">Fill in the product details below</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isBusy}
                  className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center disabled:opacity-40"
                >
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

                {/* ── Product Image ── */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Product Image</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                    id="product-image-input"
                  />

                  {!imagePreview ? (
                    <label
                      htmlFor="product-image-input"
                      className="flex flex-col items-center justify-center gap-2 w-full h-36 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 cursor-pointer hover:border-teal-400 hover:bg-teal-50/40 transition-all group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-slate-100 group-hover:bg-teal-100 flex items-center justify-center transition-colors">
                        <svg className="w-5 h-5 text-slate-400 group-hover:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-600 group-hover:text-teal-600 transition-colors">Click to upload image</p>
                        <p className="text-xs text-slate-400 mt-0.5">JPEG, PNG, WEBP, GIF · max 5MB</p>
                      </div>
                    </label>
                  ) : (
                    <div className="relative">
                      <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        <Image
                          src={imagePreview}
                          alt="Product preview"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          disabled={isUploading}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-lg text-xs font-semibold transition-colors disabled:opacity-60"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                          Remove
                        </button>
                        <label htmlFor="product-image-input" className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer">
                          Change
                        </label>
                      </div>
                    </div>
                  )}

                  {imageError && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                      {imageError}
                    </p>
                  )}
                </div>

                {/* ── Product Info ── */}
                {textField('Product Name', 'pd_name', 'text', 'e.g. Apsara Sofa 3-Seater', true)}

                <div className="grid grid-cols-2 gap-3">
                  {textField('Category ID', 'pd_catid', 'number', 'e.g. 1', true)}
                  {textField('Parent SKU', 'pd_parent_sku', 'text', 'e.g. SOFA-001')}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
                  <textarea
                    value={form.pd_description}
                    onChange={(e) => set('pd_description', e.target.value)}
                    placeholder="Product description..."
                    rows={3}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all resize-none"
                  />
                </div>

                {/* ── Pricing ── */}
                <div className="grid grid-cols-2 gap-3">
                  {textField('SRP Price (₱)', 'pd_price_srp', 'number', '0.00', true)}
                  {textField('DP Price (₱)', 'pd_price_dp', 'number', '0.00')}
                </div>

                {/* ── Stock & Weight ── */}
                <div className="grid grid-cols-2 gap-3">
                  {textField('Quantity', 'pd_qty', 'number', '0')}
                  {textField('Weight (g)', 'pd_weight', 'number', '0')}
                </div>

                {/* ── Package Dimensions ── */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Package Dimensions</p>
                  <div className="grid grid-cols-3 gap-3">
                    {textField('Weight (kg)', 'pd_psweight', 'number', '0.00')}
                    {textField('Length (cm)', 'pd_pslenght', 'number', '0.00')}
                    {textField('Height (cm)', 'pd_psheight', 'number', '0.00')}
                  </div>
                </div>

                {/* ── Type & Status ── */}
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

                {/* ── Flags ── */}
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

                {/* ── Actions ── */}
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={handleClose} disabled={isBusy}
                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60">
                    Cancel
                  </button>
                  <button type="submit" disabled={isBusy}
                    className="flex-1 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-teal-500/30 flex items-center justify-center gap-2 disabled:opacity-60">
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                        </svg>
                        Add Product
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
