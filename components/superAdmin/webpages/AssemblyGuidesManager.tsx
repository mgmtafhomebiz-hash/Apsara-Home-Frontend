'use client'

import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react'
import {
  useCreateAdminWebPageItemMutation,
  useDeleteAdminWebPageItemMutation,
  useGetAdminWebPageItemsQuery,
  useUpdateAdminWebPageItemMutation,
  WebPageItem,
} from '@/store/api/webPagesApi'
import { showErrorToast, showSuccessToast } from '@/libs/toast'

type FormState = {
  title: string
  image_url: string
  pdf_url: string
  sort_order: string
  is_active: boolean
}

const emptyForm: FormState = {
  title: '',
  image_url: '',
  pdf_url: '',
  sort_order: '0',
  is_active: true,
}

const toPayload = (form: FormState) => ({
  title: form.title.trim() || undefined,
  image_url: form.image_url.trim() || undefined,
  link_url: form.pdf_url.trim() || undefined,
  button_text: 'Open PDF',
  sort_order: Number(form.sort_order || 0),
  is_active: form.is_active,
})

const toForm = (item: WebPageItem): FormState => ({
  title: item.title ?? '',
  image_url: item.image_url ?? '',
  pdf_url: item.link_url ?? '',
  sort_order: String(item.sort_order ?? 0),
  is_active: item.is_active,
})

export default function AssemblyGuidesManager() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<'active' | 'inactive' | 'all'>('all')
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editTarget, setEditTarget] = useState<WebPageItem | null>(null)
  const [isUploadingPdf, setIsUploadingPdf] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const pdfInputRef = useRef<HTMLInputElement | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)

  const { data, isLoading, isFetching, isError } = useGetAdminWebPageItemsQuery({
    type: 'assembly-guides',
    page,
    perPage: 20,
    search: search.trim() || undefined,
    status,
  })

  const [createItem, { isLoading: isCreating }] = useCreateAdminWebPageItemMutation()
  const [updateItem, { isLoading: isUpdating }] = useUpdateAdminWebPageItemMutation()
  const [deleteItem] = useDeleteAdminWebPageItemMutation()

  const rows = useMemo(() => data?.items ?? [], [data?.items])
  const isBusy = isCreating || isUpdating

  const resetForm = () => {
    setForm(emptyForm)
    setEditTarget(null)
    if (pdfInputRef.current) {
      pdfInputRef.current.value = ''
    }
    if (coverInputRef.current) {
      coverInputRef.current.value = ''
    }
  }

  const handlePdfUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const payload = new FormData()
    payload.append('file', file)
    payload.append('folder', 'assembly-guides')
    payload.append('asset_type', 'pdf')

    setIsUploadingPdf(true)

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: payload,
      })

      const result = (await response.json()) as { url?: string; error?: string }

      if (!response.ok || !result.url) {
        throw new Error(result.error || 'Failed to upload PDF.')
      }

      setForm((prev) => ({
        ...prev,
        pdf_url: result.url ?? prev.pdf_url,
      }))
      showSuccessToast('PDF uploaded successfully.')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload PDF.'
      showErrorToast(message)
    } finally {
      setIsUploadingPdf(false)
      if (pdfInputRef.current) {
        pdfInputRef.current.value = ''
      }
    }
  }

  const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const payload = new FormData()
    payload.append('file', file)
    payload.append('folder', 'assembly-guides')

    setIsUploadingCover(true)

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: payload,
      })

      const result = (await response.json()) as { url?: string; error?: string }

      if (!response.ok || !result.url) {
        throw new Error(result.error || 'Failed to upload cover image.')
      }

      setForm((prev) => ({
        ...prev,
        image_url: result.url ?? prev.image_url,
      }))
      showSuccessToast('Cover image uploaded successfully.')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload cover image.'
      showErrorToast(message)
    } finally {
      setIsUploadingCover(false)
      if (coverInputRef.current) {
        coverInputRef.current.value = ''
      }
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      if (editTarget) {
        await updateItem({ type: 'assembly-guides', id: editTarget.id, data: toPayload(form) }).unwrap()
        showSuccessToast('Assembly guide updated successfully.')
      } else {
        await createItem({ type: 'assembly-guides', data: toPayload(form) }).unwrap()
        showSuccessToast('Assembly guide created successfully.')
      }
      resetForm()
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string; errors?: Record<string, string[]> } }
      const firstValidation = apiErr?.data?.errors ? Object.values(apiErr.data.errors)[0]?.[0] : undefined
      showErrorToast(firstValidation || apiErr?.data?.message || 'Failed to save assembly guide.')
    }
  }

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Delete this PDF guide?')
    if (!confirmed) return

    try {
      await deleteItem({ type: 'assembly-guides', id }).unwrap()
      showSuccessToast('Assembly guide deleted successfully.')
      if (editTarget?.id === id) resetForm()
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } }
      showErrorToast(apiErr?.data?.message || 'Failed to delete assembly guide.')
    }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-cyan-100 bg-[linear-gradient(135deg,_#f0fdfa,_#ffffff_58%,_#ecfeff)] shadow-[0_24px_70px_rgba(15,118,110,0.08)]">
        <div className="grid gap-6 px-6 py-7 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-700">PDF Workspace</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Assembly Guides Manager</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Add direct PDF guides for the public Assembly Guides page. Keep the form simple: title, PDF link, optional cover image, then publish.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-cyan-100 bg-white/80 p-5">
            <p className="text-sm font-bold text-slate-900">Quick rules</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <li>Use a direct PDF URL</li>
              <li>Cover image is optional</li>
              <li>Inactive guides stay hidden from public page</li>
              <li>Lower sort number appears first</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={handleSubmit} className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">
                {editTarget ? 'Edit Mode' : 'Create'}
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">
                {editTarget ? 'Update PDF Guide' : 'Add PDF Guide'}
              </h2>
            </div>

            {editTarget ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel Edit
              </button>
            ) : null}
          </div>

          <div className="mt-5 space-y-4">
            <Field label="Guide Title">
              <input
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Ex. ARPER BED 72x75 Assembly Guide"
                className={inputClassName}
              />
            </Field>

            <Field label="PDF URL">
              <div className="space-y-3">
                <div className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Attach PDF file</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Upload a PDF here and we will automatically fill and lock the PDF URL for you.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      ref={pdfInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => pdfInputRef.current?.click()}
                      disabled={isUploadingPdf}
                      className="rounded-2xl border border-cyan-200 bg-white px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isUploadingPdf ? 'Uploading PDF...' : 'Attach PDF'}
                    </button>
                  </div>
                </div>

                <input
                  value={form.pdf_url}
                  readOnly
                  disabled
                  placeholder="Upload a PDF to generate the link"
                  className={`${inputClassName} cursor-not-allowed bg-slate-100 text-slate-500 disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500`}
                />
              </div>
            </Field>

            <Field label="Cover Image URL">
              <div className="space-y-3">
                <div className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Attach cover image</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Upload an optional preview image and we will auto-fill and lock the cover URL.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      disabled={isUploadingCover}
                      className="rounded-2xl border border-cyan-200 bg-white px-4 py-2.5 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isUploadingCover ? 'Uploading image...' : 'Attach Image'}
                    </button>
                  </div>
                </div>

                <input
                  value={form.image_url}
                  readOnly
                  disabled
                  placeholder="Optional preview image"
                  className={`${inputClassName} cursor-not-allowed bg-slate-100 text-slate-500 disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500`}
                />
              </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
              <Field label="Sort Order">
                <input
                  type="number"
                  min={0}
                  value={form.sort_order}
                  onChange={(e) => setForm((prev) => ({ ...prev, sort_order: e.target.value }))}
                  className={inputClassName}
                />
              </Field>

              <Field label="Visibility">
                <label className="flex h-[46px] items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700">
                  <span>{form.is_active ? 'Visible on public page' : 'Hidden from public page'}</span>
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                    className="h-4 w-4 accent-cyan-600"
                  />
                </label>
              </Field>
            </div>

            <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 px-4 py-3 text-sm text-cyan-800">
              Tip: the PDF URL is auto-generated from the attached file and stays locked to avoid accidental edits. If you need a different file, just attach a new PDF.
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isBusy}
              className="rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isBusy ? 'Saving...' : editTarget ? 'Update Guide' : 'Create Guide'}
            </button>
          </div>
        </form>

        <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Preview</p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">Guide Card Preview</h2>
            </div>
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-700">
              PDF
            </span>
          </div>

          <div className="mt-5 overflow-hidden rounded-[1.75rem] border border-orange-100 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="rounded-t-[1.75rem] border-b border-orange-100 bg-[linear-gradient(135deg,_#fff7ed,_#fffbf5_45%,_#ffedd5)] p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-sm ring-1 ring-orange-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M9 15h6" />
                    <path d="M9 11h2" />
                  </svg>
                </div>
                <span className="rounded-full border border-orange-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-orange-500">
                  PDF
                </span>
              </div>
            </div>

            <div className="p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
                PDF Guide
              </p>
              <h3 className="mt-3 text-xl font-bold leading-tight text-slate-900">
                {form.title.trim() || 'Your guide title will appear here'}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Click to open this PDF assembly guide.
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm font-semibold text-orange-600">Open PDF</span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M7 17 17 7" />
                    <path d="M8 7h9v9" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Library</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">Existing PDF Guides</h2>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search guide title..."
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 md:w-80"
            />
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as 'active' | 'inactive' | 'all')
                setPage(1)
              }}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
            >
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          {isError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Failed to load assembly guides.
            </div>
          ) : isLoading ? (
            <div className="space-y-3 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : rows.length ? (
            <div className="space-y-3">
              {rows.map((row) => (
                <div
                  key={row.id}
                  className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-100 bg-slate-50/80 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-cyan-600 shadow-sm ring-1 ring-slate-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <path d="M14 2v6h6" />
                          <path d="M9 15h6" />
                          <path d="M9 11h2" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{row.title || '(Untitled)'}</p>
                        <p className="mt-1 truncate text-xs text-slate-500">{row.link_url || 'No PDF URL'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 md:justify-end">
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                      Sort {row.sort_order}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                      {row.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => {
                        setEditTarget(row)
                        setForm(toForm(row))
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
              No PDF guides found.
            </div>
          )}
        </div>

        {isFetching ? <div className="mt-4 text-xs text-slate-500">Refreshing...</div> : null}

        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            Showing {data?.meta?.from ?? 0} - {data?.meta?.to ?? 0} of {data?.meta?.total ?? 0}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={(data?.meta?.current_page ?? 1) <= 1}
              className="rounded-xl border border-slate-200 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            <span>
              Page {data?.meta?.current_page ?? 1} / {data?.meta?.last_page ?? 1}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={(data?.meta?.current_page ?? 1) >= (data?.meta?.last_page ?? 1)}
              className="rounded-xl border border-slate-200 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  )
}

const inputClassName =
  'w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100'
