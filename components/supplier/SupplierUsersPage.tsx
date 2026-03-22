'use client'

import { useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  useDeleteSupplierUserMutation,
  useGetSupplierUsersQuery,
  useInviteSupplierUserMutation,
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

export default function SupplierUsersPage() {
  const { data: session } = useSession()
  const supplierId = Number(session?.user?.supplierId ?? 0)
  const isMainSupplier = Boolean(session?.user?.isMainSupplier)
  const { data, isLoading, isError } = useGetSupplierUsersQuery(supplierId || undefined, {
    skip: supplierId <= 0,
  })
  const [inviteSupplierUser, { isLoading: isInviting }] = useInviteSupplierUserMutation()
  const [deleteSupplierUser, { isLoading: isDeleting }] = useDeleteSupplierUserMutation()
  const [inviteForm, setInviteForm] = useState(defaultInviteForm)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [setupUrl, setSetupUrl] = useState<string | null>(null)

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

  const handleCopy = async () => {
    if (!setupUrl) return
    await navigator.clipboard.writeText(setupUrl)
  }

  if (supplierId <= 0) {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
        This supplier account is not linked to a supplier company yet.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-cyan-100 bg-[linear-gradient(135deg,_#ecfeff,_#ffffff_55%,_#f0fdfa)] p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-700">Supplier Users</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Manage your supplier team access.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Give each staff member their own supplier portal login so they can upload and maintain products safely.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Invite</p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">
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
                <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">Setup Link</p>
                  <p className="mt-2 break-all text-sm text-slate-700">{setupUrl}</p>
                  <button
                    type="button"
                    onClick={() => void handleCopy()}
                    className="mt-3 rounded-xl border border-cyan-200 bg-white px-3 py-2 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100"
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
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Only the main supplier account can invite sub-supplier users. This account can still manage products under the assigned categories.
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Current Team</p>
              <h2 className="mt-2 text-lg font-bold text-slate-900">Supplier Portal Users</h2>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {users.length} user{users.length === 1 ? '' : 's'}
            </span>
          </div>

          {isLoading ? (
            <p className="mt-5 text-sm text-slate-500">Loading supplier users...</p>
          ) : isError ? (
            <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Failed to load supplier users.
            </p>
          ) : users.length === 0 ? (
            <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              No supplier users yet.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{user.fullname || user.username}</p>
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                          user.is_main_supplier
                            ? 'border-cyan-200 bg-cyan-50 text-cyan-700'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        {user.role_label || (user.is_main_supplier ? 'Main Supplier' : 'Sub Supplier')}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">@{user.username}</p>
                    <p className="mt-1 text-xs text-slate-500">{user.email || 'No email provided'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleDelete(user.id)}
                    disabled={isDeleting || !isMainSupplier || user.is_main_supplier}
                    className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
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

function Feedback({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        type === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-red-200 bg-red-50 text-red-700'
      }`}
    >
      {message}
    </div>
  )
}

const inputClassName =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100'
