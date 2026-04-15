'use client'

import { FormEvent, useMemo, useState } from 'react'
import { showErrorToast, showSuccessToast } from '@/libs/toast'
import {
  ExpenseCategory,
  useCreateExpenseCategoryMutation,
  useDeleteExpenseCategoryMutation,
  useGetExpenseCategoriesQuery,
  useUpdateExpenseCategoryMutation,
} from '@/store/api/expenseCategoriesApi'

type CategoryFormState = {
  name: string
  description: string
  status: number
}

const emptyForm: CategoryFormState = {
  name: '',
  description: '',
  status: 1,
}

const getApiMessage = (error: unknown, fallback: string) => {
  const apiError = error as {
    data?: {
      message?: string
      errors?: Record<string, string[]>
    }
  }

  const firstValidation = apiError?.data?.errors
    ? Object.values(apiError.data.errors).flat()[0]
    : undefined

  return firstValidation || apiError?.data?.message || fallback
}

export default function ExpenseCategoriesPageMain() {
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null)
  const [form, setForm] = useState<CategoryFormState>(emptyForm)

  const { data, isLoading, isFetching, isError } = useGetExpenseCategoriesQuery({
    search: search.trim() || undefined,
  })

  const [createCategory, { isLoading: isCreating }] = useCreateExpenseCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateExpenseCategoryMutation()
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteExpenseCategoryMutation()

  const categories = data?.categories ?? []
  const activeCount = useMemo(() => categories.filter((category) => category.status === 1).length, [categories])

  const openAddModal = () => {
    setEditingCategory(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  const openEditModal = (category: ExpenseCategory) => {
    setEditingCategory(category)
    setForm({
      name: category.name || '',
      description: category.description || '',
      status: category.status ?? 1,
    })
    setFormOpen(true)
  }

  const closeModal = () => {
    if (isCreating || isUpdating) return
    setFormOpen(false)
    setEditingCategory(null)
    setForm(emptyForm)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
    }

    if (!payload.name) {
      showErrorToast('Expense category name is required.')
      return
    }

    try {
      if (editingCategory) {
        const response = await updateCategory({
          id: editingCategory.id,
          data: payload,
        }).unwrap()
        showSuccessToast(response.message || 'Expense category updated.')
      } else {
        const response = await createCategory(payload).unwrap()
        showSuccessToast(response.message || 'Expense category created.')
      }

      closeModal()
    } catch (error) {
      showErrorToast(getApiMessage(error, 'Failed to save expense category.'))
    }
  }

  const handleDelete = async (category: ExpenseCategory) => {
    const shouldDelete = window.confirm(`Delete "${category.name}" expense category?`)
    if (!shouldDelete) return

    try {
      const response = await deleteCategory(category.id).unwrap()
      showSuccessToast(response.message || 'Expense category deleted.')
    } catch (error) {
      showErrorToast(getApiMessage(error, 'Failed to delete expense category.'))
    }
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50 p-6 shadow-sm">
        <div className="pointer-events-none absolute -right-24 -top-20 h-52 w-52 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-200/35 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-700">Expenses</p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900">Expense Categories</h1>
              <p className="mt-2 text-sm text-slate-600">
                Add and manage expense types used by accounting entries.
              </p>
            </div>
            <button
              type="button"
              onClick={openAddModal}
              className="rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
            >
              + Add Category
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Total</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{categories.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Active</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">{activeCount}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Inactive</p>
              <p className="mt-1 text-2xl font-bold text-amber-700">{Math.max(0, categories.length - activeCount)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search expense category..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800"
            />
          </div>
          <p className="text-xs text-slate-500">{isFetching ? 'Refreshing...' : `${categories.length} categories`}</p>
        </div>

        {isError ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Failed to load expense categories.
          </div>
        ) : null}

        {isLoading ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-36 animate-pulse rounded-2xl border border-slate-100 bg-slate-50" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <p className="text-base font-semibold text-slate-700">No expense categories yet</p>
            <p className="mt-1 text-sm text-slate-500">Create one to start organizing expense entries.</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <article key={category.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{category.name}</h3>
                    <p className="mt-1 text-xs text-slate-500">ID #{category.id}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      category.status === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {category.status === 1 ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="mt-3 min-h-12 text-sm text-slate-600">
                  {category.description || 'No description provided.'}
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(category)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(category)}
                    disabled={isDeleting}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {formOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editingCategory ? 'Edit Expense Category' : 'Add Expense Category'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
              <label className="block text-sm text-slate-700">
                Category Name
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800"
                  placeholder="e.g. Office Supplies"
                  maxLength={120}
                  required
                />
              </label>

              <label className="block text-sm text-slate-700">
                Description
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                  className="mt-1 h-24 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800"
                  placeholder="Optional details about this expense type..."
                  maxLength={500}
                />
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.status === 1}
                  onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.checked ? 1 : 0 }))}
                />
                Active category
              </label>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {isCreating || isUpdating ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

