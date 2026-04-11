'use client'

import { useMemo, useState } from 'react'
import { showErrorToast, showSuccessToast } from '@/libs/toast'
import {
  useCreatePartnerUserMutation,
  useDeletePartnerUserMutation,
  useGetPartnerUsersQuery,
  useUpdatePartnerUserMutation,
  type PartnerUserItem,
} from '@/store/api/partnerUsersApi'

type FormState = {
  name: string
  username: string
  email: string
  password: string
}

const emptyForm: FormState = {
  name: '',
  username: '',
  email: '',
  password: '',
}

export default function PartnerUsersPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<PartnerUserItem | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [showPassword, setShowPassword] = useState(false)
  const { data, isLoading, isError } = useGetPartnerUsersQuery({ search })
  const [createUser, { isLoading: isCreating }] = useCreatePartnerUserMutation()
  const [updateUser, { isLoading: isUpdating }] = useUpdatePartnerUserMutation()
  const [deleteUser, { isLoading: isDeleting }] = useDeletePartnerUserMutation()

  const users = useMemo(() => data?.users ?? [], [data?.users])
  const busy = isCreating || isUpdating || isDeleting

  const resetForm = () => {
    setSelected(null)
    setForm(emptyForm)
  }

  const startEdit = (user: PartnerUserItem) => {
    setSelected(user)
    setForm({
      name: user.name,
      username: user.username,
      email: user.email ?? '',
      password: '',
    })
  }

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.username.trim()) {
      showErrorToast('Name and username are required.')
      return
    }

    try {
      if (selected) {
        await updateUser({
          id: selected.id,
          name: form.name.trim(),
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password.trim() || undefined,
        }).unwrap()
        showSuccessToast('Partner user updated.')
      } else {
        if (!form.password.trim()) {
          showErrorToast('Password is required for new users.')
          return
        }
        await createUser({
          name: form.name.trim(),
          username: form.username.trim(),
          email: form.email.trim() || undefined,
          password: form.password.trim(),
        }).unwrap()
        showSuccessToast('Partner user created.')
      }
      resetForm()
    } catch (error) {
      const apiErr = error as { data?: { message?: string } }
      showErrorToast(apiErr?.data?.message || 'Failed to save partner user.')
    }
  }

  const handleDelete = async (user: PartnerUserItem) => {
    if (busy) return
    if (!confirm(`Delete @${user.username}?`)) return
    try {
      await deleteUser({ id: user.id }).unwrap()
      showSuccessToast('Partner user deleted.')
      if (selected?.id === user.id) resetForm()
    } catch (error) {
      const apiErr = error as { data?: { message?: string } }
      showErrorToast(apiErr?.data?.message || 'Failed to delete partner user.')
    }
  }

  if (isLoading) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500 shadow-sm">Loading partner users...</div>
  }

  if (isError) {
    return <div className="rounded-3xl border border-red-200 bg-red-50 p-12 text-center text-sm font-semibold text-red-600 shadow-sm">Failed to load partner users.</div>
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Partner Users</p>
          <h1 className="mt-2 text-xl font-bold text-slate-900">Manage Accounts</h1>
          <p className="mt-1 text-sm text-slate-500">Create users that can only manage your storefront.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <Field label="Full Name">
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Jane Doe"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-300 focus:bg-white"
            />
          </Field>
          <Field label="Username">
            <input
              value={form.username}
              onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
              placeholder="janedoe"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-300 focus:bg-white"
            />
          </Field>
          <Field label="Email (optional)">
            <input
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="jane@email.com"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-300 focus:bg-white"
            />
          </Field>
          <Field label={selected ? 'New Password (optional)' : 'Password'}>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder={selected ? 'Leave blank to keep' : '********'}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm outline-none focus:border-cyan-300 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </Field>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={busy}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {selected ? 'Update User' : 'Create User'}
            </button>
            {selected ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </div>
      </aside>

      <section className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, username, email..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-300 focus:bg-white md:w-80"
            />
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {users.length} users
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          {users.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">No partner users yet.</p>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">@{user.username}</p>
                    {user.email ? <p className="text-xs text-slate-400">{user.email}</p> : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(user)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-cyan-300 hover:text-cyan-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(user)}
                      className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{label}</span>
      {children}
    </label>
  )
}
