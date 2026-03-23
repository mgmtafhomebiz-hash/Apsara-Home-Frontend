'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ProductBrand,
  useCreateProductBrandMutation,
  useDeleteProductBrandMutation,
  useGetProductBrandsQuery,
  useUpdateProductBrandMutation,
} from '@/store/api/productBrandsApi'
import { showErrorToast, showSuccessToast } from '@/libs/toast'

const getRequestErrorMessage = (err: unknown, fallback: string) => {
  const data = (err as { data?: { message?: string; errors?: Record<string, string[] | string> } })?.data
  const firstFieldErrors = data?.errors
    ? Object.values(data.errors)
        .flatMap((value) => Array.isArray(value) ? value : [value])
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    : []

  return firstFieldErrors[0] ?? data?.message ?? fallback
}

interface BrandModalProps {
  title: string
  initialBrand?: ProductBrand | null
  onClose: () => void
  onSubmit: (payload: { pb_name: string; pb_image?: string | null; pb_status: number }) => Promise<void>
}

function BrandModal({ title, initialBrand = null, onClose, onSubmit }: BrandModalProps) {
  const [name, setName] = useState(initialBrand?.name ?? '')
  const [image, setImage] = useState(initialBrand?.image ?? '')
  const [status, setStatus] = useState(String(initialBrand?.status ?? 0))
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setError('Only JPEG, PNG, WEBP, or GIF files are allowed.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Brand image must be 5MB or smaller.')
      return
    }

    setIsUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Image upload failed.')
      setImage(json.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Brand name is required.')
      return
    }

    setIsSaving(true)
    setError('')
    try {
      await onSubmit({ pb_name: trimmedName, pb_image: image || null, pb_status: Number(status) })
    } catch (err) {
      setError(getRequestErrorMessage(err, 'Failed to save brand.'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          onClick={(event) => event.stopPropagation()}
          className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{title}</h2>
              <p className="mt-1 text-sm text-slate-500">Manage product brand names and status.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:text-slate-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Brand Name</label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError('')
                }}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
                placeholder="e.g. AF Appliance"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Brand Image</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3">
                <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                  {image ? (
                    <Image src={image} alt={name || 'Brand image'} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-400">No Img</div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                    >
                      {isUploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                    {image && (
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">Optional logo or brand image for admin management.</p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="0">Active</option>
                <option value="1">Disabled</option>
              </select>
            </div>

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || isUploading}
                className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : 'Save Brand'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function BrandsPageMain() {
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBrand, setEditingBrand] = useState<ProductBrand | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { data, isLoading, isFetching } = useGetProductBrandsQuery({ search: search.trim() || undefined })
  const [createBrand] = useCreateProductBrandMutation()
  const [updateBrand] = useUpdateProductBrandMutation()
  const [deleteBrand] = useDeleteProductBrandMutation()

  const brands = useMemo(() => data?.brands ?? [], [data?.brands])
  const activeCount = useMemo(() => brands.filter((brand) => brand.status === 0).length, [brands])

  const handleCreateBrand = async (payload: { pb_name: string; pb_image?: string | null; pb_status: number }) => {
    await createBrand(payload).unwrap()
    showSuccessToast('Brand added successfully.')
    setShowAddModal(false)
  }

  const handleUpdateBrand = async (payload: { pb_name: string; pb_image?: string | null; pb_status: number }) => {
    if (!editingBrand) return
    await updateBrand({ id: editingBrand.id, data: payload }).unwrap()
    showSuccessToast('Brand updated successfully.')
    setEditingBrand(null)
  }

  const handleDeleteBrand = async (id: number) => {
    setDeletingId(id)
    try {
      await deleteBrand(id).unwrap()
      showSuccessToast('Brand deleted successfully.')
    } catch (err) {
      showErrorToast(getRequestErrorMessage(err, 'Failed to delete brand.'))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Link href="/admin/products" className="transition hover:text-slate-600">Products</Link>
            <span>/</span>
            <span className="font-medium text-slate-600">Brands</span>
          </div>
          <h1 className="mt-2 text-xl font-bold text-slate-800">Product Brands</h1>
          <p className="mt-1 text-sm text-slate-500">Manage product brands used in product dropdown selections.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          Add Brand
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4">
          <p className="text-2xl font-bold text-slate-900">{data?.total ?? 0}</p>
          <p className="mt-1 text-xs text-slate-500">Total Brands</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4">
          <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
          <p className="mt-1 text-xs text-slate-500">Active Brands</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4">
          <p className="text-2xl font-bold text-amber-600">{brands.filter((brand) => brand.status === 1).length}</p>
          <p className="mt-1 text-xs text-slate-500">Disabled Brands</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brands..."
            className="w-full max-w-sm rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
          />
          <p className="text-xs text-slate-400">{isFetching ? 'Refreshing...' : `${brands.length} brand(s)`}</p>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-100">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Brand</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Image</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-400">Loading brands...</td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-400">No brands found yet.</td>
                </tr>
              ) : brands.map((brand) => (
                <tr key={brand.id}>
                  <td className="px-4 py-4">
                    <div className="font-semibold text-slate-800">{brand.name}</div>
                    <div className="mt-1 text-xs text-slate-400">ID #{brand.id}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-slate-100">
                      {brand.image ? (
                        <Image src={brand.image} alt={brand.name} fill className="object-cover" unoptimized />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-slate-400">No Img</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${brand.status === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {brand.status === 0 ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingBrand(brand)}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => void handleDeleteBrand(brand.id)}
                        disabled={deletingId === brand.id}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                      >
                        {deletingId === brand.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <BrandModal
          title="Add Brand"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleCreateBrand}
        />
      )}

      {editingBrand && (
        <BrandModal
          title="Edit Brand"
          initialBrand={editingBrand}
          onClose={() => setEditingBrand(null)}
          onSubmit={handleUpdateBrand}
        />
      )}
    </div>
  )
}
