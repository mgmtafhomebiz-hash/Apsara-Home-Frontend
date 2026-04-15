'use client'

import { FormEvent, useMemo, useState } from 'react'
import { showErrorToast, showSuccessToast } from '@/libs/toast'
import {
  Expense,
  ExpensePayload,
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
  useGetExpensesQuery,
  useUpdateExpenseMutation,
} from '@/store/api/expensesApi'
import { useGetExpenseCategoriesQuery } from '@/store/api/expenseCategoriesApi'

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 2,
  }).format(value || 0)

const formatDateShort = (value?: string | null) => {
  if (!value) return ''

  const raw = String(value).trim()
  // Prefer the date part to avoid timezone shifts (e.g. ISO strings).
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])
    if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)) {
      const d = new Date(year, month - 1, day)
      return new Intl.DateTimeFormat('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }).format(d)
    }
  }

  const fallback = new Date(raw)
  if (Number.isNaN(fallback.getTime())) return raw
  return new Intl.DateTimeFormat('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }).format(fallback)
}

const todayKey = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const getApiMessage = (error: unknown, fallback: string) => {
  const apiError = error as {
    data?: {
      message?: string
      errors?: Record<string, string[]>
    }
  }

  const firstValidation = apiError?.data?.errors ? Object.values(apiError.data.errors).flat()[0] : undefined
  return firstValidation || apiError?.data?.message || fallback
}

type FormState = {
  category_id: number
  amount: string
  transaction_date: string
  intent: string
  status: number
}

const emptyForm = (): FormState => ({
  category_id: 0,
  amount: '',
  transaction_date: todayKey(),
  intent: '',
  status: 1,
})

export default function ExpensesPageMain() {
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Expense | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm())

  const { data: categoriesData } = useGetExpenseCategoriesQuery()
  const categories = useMemo(
    () => (categoriesData?.categories ?? []).filter((category) => (category.status ?? 1) === 1),
    [categoriesData],
  )

  const { data, isLoading, isFetching, isError, error: loadError } = useGetExpensesQuery({
    search: search.trim() || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  })

  const expenses = data?.expenses ?? []
  const totalAmount = useMemo(() => expenses.reduce((sum, row) => sum + Number(row.amount ?? 0), 0), [expenses])

  const loadErrorMessage = useMemo(() => {
    if (!loadError) return null
    const err = loadError as { status?: number; data?: { message?: string } | string }
    const status = typeof err.status === 'number' ? err.status : undefined
    const message =
      typeof err.data === 'string'
        ? err.data
        : (err.data as { message?: string } | undefined)?.message

    if (status === 401) return 'Your session expired. Please refresh the page or sign in again.'
    if (status === 403) return message || 'You do not have access to view expenses.'
    return message || 'Failed to load expenses.'
  }, [loadError])

  const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation()
  const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation()
  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation()

  const openAdd = () => {
    setEditing(null)
    setForm((prev) => {
      const next = emptyForm()
      const firstCategory = categories[0]
      if (firstCategory) next.category_id = firstCategory.id
      return { ...next, transaction_date: prev.transaction_date || next.transaction_date }
    })
    setModalOpen(true)
  }

  const openEdit = (row: Expense) => {
    setEditing(row)
    setForm({
      category_id: row.category_id,
      amount: String(row.amount ?? ''),
      transaction_date: row.transaction_date || todayKey(),
      intent: row.intent || '',
      status: row.status ?? 1,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    if (isCreating || isUpdating) return
    setModalOpen(false)
    setEditing(null)
    setForm(emptyForm())
  }

  const toPayload = (): ExpensePayload | null => {
    const amount = Number(form.amount)
    if (!Number.isFinite(amount) || amount < 0) {
      showErrorToast('Amount must be a valid number.')
      return null
    }
    if (!form.category_id || form.category_id <= 0) {
      showErrorToast('Please select a category.')
      return null
    }
    if (!form.transaction_date) {
      showErrorToast('Transaction date is required.')
      return null
    }
    if (!form.intent.trim()) {
      showErrorToast('Intent is required.')
      return null
    }

    return {
      category_id: form.category_id,
      amount,
      transaction_date: form.transaction_date,
      intent: form.intent.trim(),
      status: form.status,
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = toPayload()
    if (!payload) return

    try {
      if (editing) {
        const response = await updateExpense({ id: editing.id, data: payload }).unwrap()
        showSuccessToast(response.message || 'Expense updated.')
      } else {
        const response = await createExpense(payload).unwrap()
        showSuccessToast(response.message || 'Expense created.')
      }
      closeModal()
    } catch (error) {
      showErrorToast(getApiMessage(error, 'Failed to save expense.'))
    }
  }

  const handleDelete = async (row: Expense) => {
    const ok = window.confirm(
      `Delete this expense?\n\n${row.category?.name || 'Category'} • ${formatMoney(row.amount)} • ${formatDateShort(row.transaction_date)}`,
    )
    if (!ok) return

    try {
      const response = await deleteExpense(row.id).unwrap()
      showSuccessToast(response.message || 'Expense deleted.')
    } catch (error) {
      showErrorToast(getApiMessage(error, 'Failed to delete expense.'))
    }
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50 p-6 shadow-sm">
        <div className="pointer-events-none absolute -right-24 -top-20 h-52 w-52 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-200/35 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-700">Accounting</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Expenses</h1>
            <p className="mt-2 text-sm text-slate-600">Add and manage expense entries by category and transaction date.</p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
          >
            + Add Expense
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Records</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{expenses.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Total (Filtered)</p>
            <p className="mt-1 text-2xl font-bold text-emerald-700">{formatMoney(totalAmount)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Categories</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{categories.length}</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_auto] lg:items-end">
            <label className="text-xs text-slate-500">
              Search
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by category or intent..."
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800"
              />
            </label>

            <label className="text-xs text-slate-500">
              From
              <input
                type="date"
                value={dateFrom}
                onChange={(event) => setDateFrom(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800"
              />
            </label>

            <label className="text-xs text-slate-500">
              To
              <input
                type="date"
                value={dateTo}
                onChange={(event) => setDateTo(event.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                setSearch('')
                setDateFrom('')
                setDateTo('')
              }}
              className="h-[42px] rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Clear
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <p className="text-xs text-slate-500">{isFetching ? 'Refreshing...' : `${expenses.length} result(s)`}</p>
          </div>
        </div>

        {isError ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {loadErrorMessage || 'Failed to load expenses.'}
          </div>
        ) : null}

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs font-semibold text-slate-500">
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Intent</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Transaction Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                    Loading expenses...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                    No expenses found.
                  </td>
                </tr>
              ) : (
                expenses.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 last:border-b-0 text-sm">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{row.category?.name || 'Category'}</p>
                      <p className="text-xs text-slate-400">#{row.id}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <p className="line-clamp-2">{row.intent}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{formatMoney(Number(row.amount ?? 0))}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDateShort(row.transaction_date)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(row)}
                          className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row)}
                          disabled={isDeleting}
                          className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{editing ? 'Edit Expense' : 'Add Expense'}</h2>
                <p className="mt-0.5 text-xs text-slate-500">Category, amount, date, and intent.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
              <label className="block text-sm text-slate-700">
                Expense Category
                <select
                  value={form.category_id}
                  onChange={(event) => setForm((prev) => ({ ...prev, category_id: Number(event.target.value) }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800"
                  required
                >
                  <option value={0} disabled>
                    Select category
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm text-slate-700">
                  Amount
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.amount}
                    onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800"
                    placeholder="0.00"
                    required
                  />
                </label>

                <label className="block text-sm text-slate-700">
                  Transaction Date
                  <input
                    type="date"
                    value={form.transaction_date}
                    onChange={(event) => setForm((prev) => ({ ...prev, transaction_date: event.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800"
                    required
                  />
                </label>
              </div>

              <label className="block text-sm text-slate-700">
                Intent
                <textarea
                  value={form.intent}
                  onChange={(event) => setForm((prev) => ({ ...prev, intent: event.target.value }))}
                  className="mt-1 h-24 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800"
                  placeholder="Describe the purpose of this expense..."
                  maxLength={500}
                  required
                />
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.status === 1}
                  onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.checked ? 1 : 0 }))}
                />
                Active expense
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
                  className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {isCreating || isUpdating ? 'Saving...' : editing ? 'Save Changes' : 'Create Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
