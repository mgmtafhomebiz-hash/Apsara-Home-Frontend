'use client'

import { useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  useDeleteSupplierUserMutation,
  useGetSupplierUsersQuery,
  useInviteSupplierUserMutation,
  useUpdateSupplierUserMutation,
} from '@/store/api/suppliersApi'

type InviteForm = {
  fullname: string
  username: string
  email: string
}

const defaultInviteForm: InviteForm = {
  fullname: '',
  username: '',
  email: '',
}

type EditForm = {
  id: number
  fullname: string
  username: string
  email: string
  password: string
  is_main_supplier?: boolean
}

export default function SupplierUsersPage() {
  const { data: session } = useSession()
  const supplierId = Number(session?.user?.supplierId ?? 0)
  const isMainSupplier = Boolean(session?.user?.isMainSupplier)
  const currentSupplierUserId = Number((session?.user as { id?: string | number } | undefined)?.id ?? 0)
  const { data, isLoading, isError, error, refetch } = useGetSupplierUsersQuery(supplierId || undefined, {
    skip: supplierId <= 0,
    refetchOnMountOrArgChange: true,
  })
  const [inviteSupplierUser, { isLoading: isInviting }] = useInviteSupplierUserMutation()
  const [updateSupplierUser, { isLoading: isUpdating }] = useUpdateSupplierUserMutation()
  const [deleteSupplierUser, { isLoading: isDeleting }] = useDeleteSupplierUserMutation()
  const [inviteForm, setInviteForm] = useState(defaultInviteForm)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [setupUrl, setSetupUrl] = useState<string | null>(null)
  const [editing, setEditing] = useState<EditForm | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; label: string } | null>(null)

  const users = useMemo(() => data?.users ?? [], [data?.users])

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (error && typeof error === 'object') {
      const dataValue = (error as {
        data?: { message?: string; errors?: Record<string, string[]> }
      }).data
      const firstEntry = dataValue?.errors ? Object.values(dataValue.errors)[0] : null
      if (Array.isArray(firstEntry) && typeof firstEntry[0] === 'string') return firstEntry[0]
      if (typeof dataValue?.message === 'string') return dataValue.message
    }

    return fallback
  }

  const handleInvite = async (event: React.FormEvent) => {
    event.preventDefault()
    setFeedback(null)
    setSetupUrl(null)

    try {
      const result = await inviteSupplierUser({
        supplier_id: supplierId,
        fullname: inviteForm.fullname.trim(),
        username: inviteForm.username.trim(),
        email: inviteForm.email.trim() || undefined,
      }).unwrap()

      setFeedback({ type: 'success', message: result.message })
      setSetupUrl(result.setup_url)
      setInviteForm(defaultInviteForm)
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Unable to create supplier user invite.'),
      })
    }
  }

  const handleDelete = async (id: number) => {
    setFeedback(null)

    try {
      const result = await deleteSupplierUser(id).unwrap()
      setFeedback({ type: 'success', message: result.message })
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Unable to remove supplier user.'),
      })
    }
  }

  const openEdit = (user: {
    id: number
    fullname: string
    username: string
    email: string
    is_main_supplier?: boolean
  }) => {
    setFeedback(null)
    setSetupUrl(null)
    setEditing({
      id: user.id,
      fullname: user.fullname || '',
      username: user.username || '',
      email: user.email || '',
      password: '',
      is_main_supplier: user.is_main_supplier,
    })
  }

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!editing) return

    setFeedback(null)
    setSetupUrl(null)

    try {
      const result = await updateSupplierUser({
        id: editing.id,
        fullname: editing.fullname.trim(),
        username: editing.username.trim(),
        email: editing.email.trim() || undefined,
        password: editing.password.trim() || undefined,
      }).unwrap()
      setFeedback({ type: 'success', message: result.message })
      setEditing(null)
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Unable to update supplier user.'),
      })
    }
  }

  const handleCopy = async () => {
    if (!setupUrl) return
    setFeedback(null)

    const text = setupUrl

    const fallbackCopy = () => {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', 'true')
      textarea.style.position = 'fixed'
      textarea.style.top = '0'
      textarea.style.left = '0'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(textarea)
      return ok
    }

    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        setFeedback({ type: 'success', message: 'Setup link copied to clipboard.' })
        return
      }

      if (fallbackCopy()) {
        setFeedback({ type: 'success', message: 'Setup link copied to clipboard.' })
        return
      }

      setFeedback({ type: 'error', message: 'Copy failed. Please copy the link manually.' })
    } catch (_error) {
      const ok = fallbackCopy()
      setFeedback({
        type: ok ? 'success' : 'error',
        message: ok ? 'Setup link copied to clipboard.' : 'Copy failed. Please copy the link manually.',
      })
    }
  }

  const loadErrorMessage = getErrorMessage(error, 'Failed to load supplier users.')

  const requestDelete = (user: { id: number; fullname: string; username: string }) => {
    setFeedback(null)
    setSetupUrl(null)
    setConfirmDelete({
      id: user.id,
      label: user.fullname?.trim() ? user.fullname : `@${user.username}`,
    })
  }

  const confirmDeleteNow = async () => {
    if (!confirmDelete) return
    setFeedback(null)
    try {
      const result = await deleteSupplierUser(confirmDelete.id).unwrap()
      setFeedback({ type: 'success', message: result.message })
      setConfirmDelete(null)
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Unable to remove supplier user.'),
      })
    }
  }

  if (supplierId <= 0) {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
        This supplier account is not linked to a supplier company yet.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-cyan-100 bg-[linear-gradient(135deg,_#ecfeff,_#ffffff_55%,_#f0fdfa)] p-6 shadow-sm dark:border-cyan-500/20 dark:bg-[linear-gradient(135deg,rgba(8,47,73,0.92),rgba(2,6,23,0.98)_55%,rgba(6,78,59,0.55))]">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-700">Supplier Users</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Manage your supplier team access.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          Give each staff member their own supplier portal login so they can upload and maintain products safely.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Invite</p>
          <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">
            {isMainSupplier ? 'Create Sub-Supplier User' : 'Invite Access'}
          </h2>
          {isMainSupplier ? (
            <form onSubmit={handleInvite} className="mt-5 space-y-4">
              <Field label="Full Name">
                <input
                  value={inviteForm.fullname}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, fullname: e.target.value }))}
                  required
                  className={inputClassName}
                />
              </Field>
              <Field label="Username">
                <input
                  value={inviteForm.username}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, username: e.target.value }))}
                  required
                  className={inputClassName}
                />
              </Field>
              <Field label="Email (Optional)">
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, email: e.target.value }))}
                  className={inputClassName}
                  placeholder="Optional"
                />
              </Field>

              {feedback ? <Feedback type={feedback.type} message={feedback.message} /> : null}

              {setupUrl ? (
                <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-500/20 dark:bg-cyan-500/10">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">Setup Link</p>
                  <p className="mt-2 break-all text-sm text-slate-700 dark:text-slate-200">{setupUrl}</p>
                  <button
                    type="button"
                    onClick={() => void handleCopy()}
                    className="mt-3 rounded-xl border border-cyan-200 bg-white px-3 py-2 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100 dark:border-cyan-500/20 dark:bg-slate-950 dark:text-cyan-200 dark:hover:bg-cyan-500/10"
                  >
                    Copy Link
                  </button>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isInviting}
                className="rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isInviting ? 'Creating invite...' : 'Create Invite Link'}
              </button>
            </form>
          ) : (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
              Only the main supplier account can invite sub-supplier users. This account can still manage products under the assigned categories.
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Current Team</p>
              <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">Supplier Portal Users</h2>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              {users.length} user{users.length === 1 ? '' : 's'}
            </span>
          </div>

          {isLoading ? (
            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">Loading supplier users...</p>
          ) : isError ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
              <p>{loadErrorMessage}</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-slate-950 dark:text-red-200 dark:hover:bg-red-500/10"
              >
                Retry
              </button>
            </div>
          ) : users.length === 0 ? (
            <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
              No supplier users yet.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-900"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.fullname || user.username}</p>
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                          user.is_main_supplier
                            ? 'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-200'
                            : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300'
                        }`}
                      >
                        {user.role_label || (user.is_main_supplier ? 'Main Supplier' : 'Sub Supplier')}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">@{user.username}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{user.email || 'No email provided'}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {/*
                      Rules:
                      - Main supplier can edit anyone (including self).
                      - Sub-suppliers can edit self only.
                    */}
                    <button
                      type="button"
                      onClick={() => openEdit(user)}
                      disabled={!(isMainSupplier || user.id === currentSupplierUserId)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-cyan-500/40 dark:hover:text-cyan-200"
                    >
                      Edit
                    </button>
                    {/*
                      Rules:
                      - Main supplier can remove sub-suppliers (not main owner row).
                      - Sub-suppliers can remove self (optional exit) but not other users.
                      - Main supplier owner account removal stays blocked.
                    */}
                    <button
                      type="button"
                      onClick={() => requestDelete(user)}
                      disabled={
                        isDeleting ||
                        (!isMainSupplier || Boolean(user.is_main_supplier))
                      }
                      className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Edit User</p>
                <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">Update supplier portal user details</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleUpdate} className="mt-5 space-y-4">
              <Field label="Full Name">
                <input
                  value={editing.fullname}
                  onChange={(e) => setEditing((prev) => (prev ? { ...prev, fullname: e.target.value } : prev))}
                  required
                  className={inputClassName}
                />
              </Field>
              <Field label="Username">
                <input
                  value={editing.username}
                  onChange={(e) => setEditing((prev) => (prev ? { ...prev, username: e.target.value } : prev))}
                  required
                  className={inputClassName}
                />
              </Field>
              <Field label="Email (Optional)">
                <input
                  type="email"
                  value={editing.email}
                  onChange={(e) => setEditing((prev) => (prev ? { ...prev, email: e.target.value } : prev))}
                  className={inputClassName}
                  placeholder="Optional"
                />
              </Field>
              <Field label="New Password (Optional)">
                <input
                  type="password"
                  value={editing.password}
                  onChange={(e) => setEditing((prev) => (prev ? { ...prev, password: e.target.value } : prev))}
                  className={inputClassName}
                  placeholder="Leave blank if you don't want to change it"
                />
                <p className="mt-2 text-xs text-slate-500">Keep this blank if you don’t want to change the password.</p>
              </Field>

              {feedback ? <Feedback type={feedback.type} message={feedback.message} /> : null}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {confirmDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4">
          <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-6 shadow-xl dark:border-red-500/20 dark:bg-slate-950">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-500">Confirm Delete</p>
            <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">Remove supplier user?</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              This will remove access for <span className="font-semibold text-slate-900 dark:text-slate-100">{confirmDelete.label}</span>.
            </p>

            {feedback ? (
              <div className="mt-4">
                <Feedback type={feedback.type} message={feedback.message} />
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void confirmDeleteNow()}
                disabled={isDeleting}
                className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? 'Removing...' : 'Yes, Remove'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      {children}
    </label>
  )
}

function Feedback({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        type === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200'
          : 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200'
      }`}
    >
      {message}
    </div>
  )
}

const inputClassName =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-cyan-500/20'
