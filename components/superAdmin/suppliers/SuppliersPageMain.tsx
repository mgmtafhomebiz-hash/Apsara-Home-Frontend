'use client'

import { useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  useCreateSupplierMutation,
  useDeleteSupplierMutation,
  useGetSuppliersQuery,
  useInviteSupplierUserMutation,
  useUpdateSupplierMutation,
} from '@/store/api/suppliersApi'

type SupplierCompanyForm = {
  name: string
  company: string
  email: string
  contact: string
  address: string
  status: '1' | '0'
}

type SupplierInviteForm = {
  supplier_id: string
  fullname: string
  username: string
  email: string
}

const defaultSupplierCompanyForm: SupplierCompanyForm = {
  name: '',
  company: '',
  email: '',
  contact: '',
  address: '',
  status: '1',
}

const defaultSupplierInviteForm: SupplierInviteForm = {
  supplier_id: '',
  fullname: '',
  username: '',
  email: '',
}

export default function SuppliersPageMain() {
  const { data: session } = useSession()
  const role = String(session?.user?.role ?? '').toLowerCase()
  const isSupplierPortal = role === 'supplier'
  const isSupplierAdmin =
    role === 'supplier_admin' || isSupplierPortal || (session?.user?.userLevelId ?? 0) === 8
  const { data, isLoading, isError } = useGetSuppliersQuery()
  const [createSupplier, { isLoading: isCreatingSupplier }] = useCreateSupplierMutation()
  const [updateSupplier, { isLoading: isUpdatingSupplier }] = useUpdateSupplierMutation()
  const [deleteSupplier, { isLoading: isDeletingSupplier }] = useDeleteSupplierMutation()
  const [inviteSupplierUser, { isLoading: isInvitingSupplierUser }] =
    useInviteSupplierUserMutation()
  const [companyForm, setCompanyForm] = useState<SupplierCompanyForm>(
    defaultSupplierCompanyForm
  )
  const [inviteForm, setInviteForm] = useState<SupplierInviteForm>(
    defaultSupplierInviteForm
  )
  const [companyFeedback, setCompanyFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const [inviteFeedback, setInviteFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const [editingSupplierId, setEditingSupplierId] = useState<number | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number
    company: string
    name: string
  } | null>(null)

  const sortedSuppliers = useMemo(
    () =>
      [...(data?.suppliers ?? [])].sort((a, b) =>
        (a.company || a.name).localeCompare(b.company || b.name)
      ),
    [data?.suppliers]
  )

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

  const handleCompanyInput =
    (field: keyof SupplierCompanyForm) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      setCompanyForm((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleInviteInput =
    (field: keyof SupplierInviteForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setInviteForm((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleCreateSupplier = async (event: React.FormEvent) => {
    event.preventDefault()
    setCompanyFeedback(null)

    try {
      const created = await createSupplier({
        name: companyForm.name.trim(),
        company: companyForm.company.trim(),
        email: companyForm.email.trim(),
        contact: companyForm.contact.trim(),
        address: companyForm.address.trim(),
        status: Number(companyForm.status),
      }).unwrap()

      setCompanyFeedback({ type: 'success', message: created.message })
      setCompanyForm(defaultSupplierCompanyForm)
      setInviteForm((prev) => ({
        ...prev,
        supplier_id: String(created.supplier.id),
      }))
    } catch (error) {
      setCompanyFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Unable to create supplier company.'),
      })
    }
  }

  const handleEditSupplier = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!editingSupplierId) return

    setCompanyFeedback(null)

    try {
      const updated = await updateSupplier({
        id: editingSupplierId,
        data: {
          name: companyForm.name.trim(),
          company: companyForm.company.trim(),
          email: companyForm.email.trim(),
          contact: companyForm.contact.trim(),
          address: companyForm.address.trim(),
          status: Number(companyForm.status),
        },
      }).unwrap()

      setCompanyFeedback({ type: 'success', message: updated.message })
      setEditingSupplierId(null)
      setIsEditModalOpen(false)
      setCompanyForm(defaultSupplierCompanyForm)
    } catch (error) {
      setCompanyFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Unable to update supplier company.'),
      })
    }
  }

  const handleInviteSupplier = async (event: React.FormEvent) => {
    event.preventDefault()
    setInviteFeedback(null)

    try {
      const result = await inviteSupplierUser({
        supplier_id: Number(inviteForm.supplier_id),
        fullname: inviteForm.fullname.trim(),
        username: inviteForm.username.trim(),
        email: inviteForm.email.trim(),
      }).unwrap()

      setInviteFeedback({ type: 'success', message: result.message })
      setInviteForm((prev) => ({
        ...defaultSupplierInviteForm,
        supplier_id: prev.supplier_id,
      }))
    } catch (error) {
      setInviteFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Unable to send supplier invite.'),
      })
    }
  }

  const startEditSupplier = (supplier: {
    id: number
    name: string
    company: string
    email: string
    contact: string
    address: string
    status: number
  }) => {
    setEditingSupplierId(supplier.id)
    setCompanyFeedback(null)
    setCompanyForm({
      name: supplier.name || '',
      company: supplier.company || '',
      email: supplier.email || '',
      contact: supplier.contact || '',
      address: supplier.address || '',
      status: supplier.status === 1 ? '1' : '0',
    })
    setIsEditModalOpen(true)
  }

  const cancelEditSupplier = () => {
    setEditingSupplierId(null)
    setCompanyForm(defaultSupplierCompanyForm)
    setIsEditModalOpen(false)
  }

  const handleDeleteSupplier = async () => {
    if (!deleteTarget) return
    setCompanyFeedback(null)

    try {
      const result = await deleteSupplier(deleteTarget.id).unwrap()
      setCompanyFeedback({ type: 'success', message: result.message })
      if (editingSupplierId === deleteTarget.id) {
        cancelEditSupplier()
      }
      setDeleteTarget(null)
    } catch (error) {
      setCompanyFeedback({
        type: 'error',
        message: getErrorMessage(error, 'Unable to delete supplier company.'),
      })
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Loading supplier data...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Failed to load supplier data.
      </div>
    )
  }

  if (sortedSuppliers.length === 0 && isSupplierAdmin) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h1 className="text-lg font-bold text-amber-900">No Supplier Linked</h1>
        <p className="mt-2 text-sm text-amber-700">
          This supplier account is not yet linked to a supplier company.
        </p>
      </div>
    )
  }

  if (isSupplierAdmin) {
    const supplier = sortedSuppliers[0]

    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-cyan-100 bg-[linear-gradient(135deg,_#ecfeff,_#ffffff_55%,_#f0fdfa)] p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-700">
            Supplier Company
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {supplier.company || supplier.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Your supplier account is scoped to this company only. Products and dashboard
            data stay limited to this profile.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <InfoCard label="Display Name" value={supplier.name || '-'} />
          <InfoCard label="Company" value={supplier.company || '-'} />
          <InfoCard label="Email" value={supplier.email || '-'} />
          <InfoCard label="Contact" value={supplier.contact || '-'} />
          <InfoCard label="Address" value={supplier.address || '-'} />
          <InfoCard
            label="Status"
            value={supplier.status === 1 ? 'Active' : 'Inactive'}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Suppliers</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create supplier companies here, then invite each company&apos;s login so they can use
          the separate supplier portal.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
              Step 1
            </p>
            <h2 className="mt-2 text-lg font-bold text-slate-900">Add Supplier Company</h2>
            <p className="mt-1 text-sm text-slate-500">
              Create the supplier company profile first before you invite its users.
            </p>
          </div>

          <form onSubmit={handleCreateSupplier} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Display Name">
                <input
                  value={companyForm.name}
                  onChange={handleCompanyInput('name')}
                  required
                  className={inputClassName}
                />
              </FormField>
              <FormField label="Company Name">
                <input
                  value={companyForm.company}
                  onChange={handleCompanyInput('company')}
                  required
                  className={inputClassName}
                />
              </FormField>
              <FormField label="Email">
                <input
                  type="email"
                  value={companyForm.email}
                  onChange={handleCompanyInput('email')}
                  className={inputClassName}
                />
              </FormField>
              <FormField label="Contact">
                <input
                  value={companyForm.contact}
                  onChange={handleCompanyInput('contact')}
                  className={inputClassName}
                />
              </FormField>
            </div>

            <FormField label="Address">
              <textarea
                value={companyForm.address}
                onChange={handleCompanyInput('address')}
                rows={3}
                className={textareaClassName}
              />
            </FormField>

            <FormField label="Status">
              <select
                value={companyForm.status}
                onChange={handleCompanyInput('status')}
                className={inputClassName}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </FormField>

            {companyFeedback ? (
              <FeedbackBanner
                type={companyFeedback.type}
                message={companyFeedback.message}
              />
            ) : null}

            <button
              type="submit"
              disabled={isCreatingSupplier}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreatingSupplier ? 'Creating supplier...' : 'Create Supplier Company'}
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
              Step 2
            </p>
            <h2 className="mt-2 text-lg font-bold text-slate-900">
              Invite Supplier Login
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              This sends a supplier portal invite to their email so they can activate
              their account and sign in.
            </p>
          </div>

          <form onSubmit={handleInviteSupplier} className="space-y-4">
            <FormField label="Supplier Company">
              <select
                value={inviteForm.supplier_id}
                onChange={handleInviteInput('supplier_id')}
                required
                className={inputClassName}
              >
                <option value="">Select supplier</option>
                {sortedSuppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.company || supplier.name}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Full Name">
                <input
                  value={inviteForm.fullname}
                  onChange={handleInviteInput('fullname')}
                  required
                  className={inputClassName}
                />
              </FormField>
              <FormField label="Username">
                <input
                  value={inviteForm.username}
                  onChange={handleInviteInput('username')}
                  required
                  className={inputClassName}
                />
              </FormField>
            </div>

            <FormField label="Email">
              <input
                type="email"
                value={inviteForm.email}
                onChange={handleInviteInput('email')}
                required
                className={inputClassName}
              />
            </FormField>

            {inviteFeedback ? (
              <FeedbackBanner
                type={inviteFeedback.type}
                message={inviteFeedback.message}
              />
            ) : null}

            <button
              type="submit"
              disabled={isInvitingSupplierUser}
              className="rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isInvitingSupplierUser ? 'Sending invite...' : 'Send Supplier Invite'}
            </button>
          </form>
        </section>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Company
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedSuppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-800">
                    {supplier.company || supplier.name}
                  </p>
                  <p className="text-xs text-slate-400">{supplier.name}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">{supplier.contact || '-'}</td>
                <td className="px-4 py-3 text-slate-600">{supplier.email || '-'}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                      supplier.status === 1
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    {supplier.status === 1 ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEditSupplier(supplier)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(supplier)}
                      disabled={isDeletingSupplier}
                      className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditModalOpen ? (
        <ModalShell onClose={cancelEditSupplier}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">
                Edit Supplier
              </p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">Update Supplier Company</h3>
            </div>
            <button
              type="button"
              onClick={cancelEditSupplier}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleEditSupplier} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Display Name">
                <input
                  value={companyForm.name}
                  onChange={handleCompanyInput('name')}
                  required
                  className={inputClassName}
                />
              </FormField>
              <FormField label="Company Name">
                <input
                  value={companyForm.company}
                  onChange={handleCompanyInput('company')}
                  required
                  className={inputClassName}
                />
              </FormField>
              <FormField label="Email">
                <input
                  type="email"
                  value={companyForm.email}
                  onChange={handleCompanyInput('email')}
                  className={inputClassName}
                />
              </FormField>
              <FormField label="Contact">
                <input
                  value={companyForm.contact}
                  onChange={handleCompanyInput('contact')}
                  className={inputClassName}
                />
              </FormField>
            </div>

            <FormField label="Address">
              <textarea
                value={companyForm.address}
                onChange={handleCompanyInput('address')}
                rows={3}
                className={textareaClassName}
              />
            </FormField>

            <FormField label="Status">
              <select
                value={companyForm.status}
                onChange={handleCompanyInput('status')}
                className={inputClassName}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </FormField>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={cancelEditSupplier}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdatingSupplier}
                className="rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdatingSupplier ? 'Saving changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </ModalShell>
      ) : null}

      {deleteTarget ? (
        <ModalShell onClose={() => setDeleteTarget(null)}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-500">
                Delete Supplier
              </p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">Confirm Delete</h3>
            </div>
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm leading-6 text-red-700">
            Delete <span className="font-semibold">{deleteTarget.company || deleteTarget.name}</span>?
            This will only work if there are no linked supplier accounts or products.
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteSupplier}
              disabled={isDeletingSupplier}
              className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeletingSupplier ? 'Deleting...' : 'Delete Supplier'}
            </button>
          </div>
        </ModalShell>
      ) : null}
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  )
}

function FeedbackBanner({ type, message }: { type: 'success' | 'error'; message: string }) {
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

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-3 text-sm font-medium leading-6 text-slate-700">{value}</p>
    </div>
  )
}

function ModalShell({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8">
      <button
        type="button"
        aria-label="Close modal backdrop"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div className="relative z-10 w-full max-w-2xl rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_30px_100px_rgba(15,23,42,0.18)]">
        {children}
      </div>
    </div>
  )
}

const inputClassName =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100'

const textareaClassName =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100'
