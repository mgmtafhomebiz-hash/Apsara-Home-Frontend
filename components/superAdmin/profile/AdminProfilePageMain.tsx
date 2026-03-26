'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChangeEvent, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useGetAdminMeQuery, useUpdateAdminMeMutation } from '@/store/api/authApi'
import { ADMIN_PERMISSION_OPTIONS, normalizeAdminPermissions } from '@/libs/adminPermissions'
import { showErrorToast, showSuccessToast } from '@/libs/toast'

const getInitials = (name?: string | null) => {
  const value = (name ?? '').trim()
  if (!value) return 'AD'
  const parts = value.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

const formatRole = (role?: string | null) => {
  if (!role) return 'Administrator'
  return role.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

const getRoleTone = (role?: string | null) => {
  switch (role) {
    case 'super_admin':
      return 'from-fuchsia-500 via-violet-500 to-indigo-500'
    case 'admin':
      return 'from-teal-500 via-cyan-500 to-sky-500'
    case 'merchant_admin':
      return 'from-rose-500 via-orange-400 to-amber-400'
    case 'supplier_admin':
      return 'from-cyan-500 via-sky-500 to-blue-500'
    case 'finance_officer':
      return 'from-indigo-500 via-blue-500 to-cyan-500'
    case 'accounting':
      return 'from-emerald-500 via-teal-500 to-cyan-500'
    case 'web_content':
      return 'from-amber-500 via-orange-500 to-rose-500'
    case 'csr':
      return 'from-blue-500 via-sky-500 to-indigo-500'
    default:
      return 'from-slate-600 via-slate-500 to-slate-400'
  }
}

const describeAccess = (role?: string | null, userLevelId?: number, permissionCount = 0) => {
  if (userLevelId === 1 || role === 'super_admin') return 'Full platform access'
  if (role === 'admin') return permissionCount > 0 ? `${permissionCount} permission areas enabled` : 'Permission-based admin access'
  if (role === 'merchant_admin') return 'Merchant-scoped access'
  if (role === 'supplier_admin') return 'Supplier-scoped access'
  return 'Scoped operational access'
}

function ProfileField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-200/40">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  )
}

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === 'object') {
    const maybeError = error as {
      message?: string
      data?: { message?: string; error?: string }
      error?: string
    }

    if (typeof maybeError.data?.message === 'string' && maybeError.data.message.trim() !== '') {
      return maybeError.data.message
    }
    if (typeof maybeError.data?.error === 'string' && maybeError.data.error.trim() !== '') {
      return maybeError.data.error
    }
    if (typeof maybeError.message === 'string' && maybeError.message.trim() !== '') {
      return maybeError.message
    }
    if (typeof maybeError.error === 'string' && maybeError.error.trim() !== '') {
      return maybeError.error
    }
  }

  return fallback
}

export default function AdminProfilePageMain() {
  const { data: session, update } = useSession()
  const sessionAccessToken = String((session?.user as { accessToken?: string } | undefined)?.accessToken ?? '')
  const adminIdentityKey = sessionAccessToken
    ? `${String((session?.user as { id?: string } | undefined)?.id ?? 'unknown')}:${sessionAccessToken}`
    : undefined
  const { data: adminMe, isLoading } = useGetAdminMeQuery(adminIdentityKey, { skip: !sessionAccessToken })
  const [updateAdminMe, { isLoading: isSavingAvatar }] = useUpdateAdminMeMutation()
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const fallbackUser = session?.user as {
    name?: string
    email?: string
    role?: string
    userLevelId?: number
    adminPermissions?: string[]
    supplierId?: number | null
    image?: string | null
  } | undefined

  const name = String(adminMe?.name ?? fallbackUser?.name ?? '').trim() || 'Admin User'
  const email = String(adminMe?.email ?? fallbackUser?.email ?? '').trim() || 'No email on file'
  const role = adminMe?.role ?? fallbackUser?.role ?? 'admin'
  const userLevelId = Number(adminMe?.user_level_id ?? fallbackUser?.userLevelId ?? 0)
  const supplierId = adminMe?.supplier_id ?? fallbackUser?.supplierId ?? null
  const avatarUrl = adminMe?.avatar_url || fallbackUser?.image || ''
  const permissions = normalizeAdminPermissions(adminMe?.admin_permissions ?? fallbackUser?.adminPermissions ?? [])
  const visiblePermissionCards =
    userLevelId === 1 || role === 'super_admin'
      ? ADMIN_PERMISSION_OPTIONS
      : ADMIN_PERMISSION_OPTIONS.filter((option) => permissions.includes(option.id))

  const syncSessionAvatar = async (nextUrl: string | null) => {
    try {
      await update({
        image: nextUrl,
        role,
        userLevelId,
        adminPermissions: permissions,
        supplierId,
      })
    } catch {
      // Session UI will still update from adminMe after refetch.
    }
  }

  const persistAvatar = async (nextUrl: string | null) => {
    const response = await updateAdminMe({ avatar_url: nextUrl }).unwrap()
    await syncSessionAvatar(response.profile.avatar_url ?? nextUrl ?? null)
    return response
  }

  const handleAvatarFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showErrorToast('Please choose a valid image file for the admin profile picture.')
      return
    }

    try {
      setIsUploadingAvatar(true)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'profile')

      const uploadResponse = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const uploadJson = await uploadResponse.json().catch(() => ({}))
      if (!uploadResponse.ok || !uploadJson?.url) {
        throw new Error(
          typeof uploadJson?.error === 'string' && uploadJson.error.trim() !== ''
            ? uploadJson.error
            : 'Unable to upload the profile image right now.'
        )
      }

      await persistAvatar(uploadJson.url)
      showSuccessToast('Admin profile picture updated successfully.')
    } catch (error) {
      showErrorToast(getApiErrorMessage(error, 'Failed to update the admin profile picture.'))
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleRemoveAvatar = async () => {
    try {
      await persistAvatar(null)
      showSuccessToast('Admin profile picture removed.')
    } catch (error) {
      showErrorToast(getApiErrorMessage(error, 'Failed to remove the admin profile picture.'))
    }
  }

  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
      >
        <div className={`absolute inset-x-0 top-0 h-44 bg-gradient-to-r ${getRoleTone(role)}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_30%)]" />

        <div className="relative px-6 pb-6 pt-8 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.6rem] border border-white/35 bg-white/15 shadow-lg shadow-slate-900/10 backdrop-blur">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={name} fill className="object-cover" sizes="96px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                    {getInitials(name)}
                  </div>
                )}
              </div>
              <div className="pt-2 text-white">
                <div className="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]">
                  Admin Profile
                </div>
                <h1 className="mt-3 text-3xl font-bold tracking-tight">{name}</h1>
                <p className="mt-2 max-w-2xl text-sm text-white/85">
                  Central view of your admin identity, access scope, and internal account details.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/25 bg-white/12 px-4 py-3 text-white backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">Role</p>
                <p className="mt-2 text-sm font-semibold">{formatRole(role)}</p>
              </div>
              <div className="rounded-2xl border border-white/25 bg-white/12 px-4 py-3 text-white backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">Access</p>
                <p className="mt-2 text-sm font-semibold">{describeAccess(role, userLevelId, visiblePermissionCards.length)}</p>
              </div>
              <div className="rounded-2xl border border-white/25 bg-white/12 px-4 py-3 text-white backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">User Level</p>
                <p className="mt-2 text-sm font-semibold">{userLevelId || 'Not set'}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white/96 p-5 shadow-lg shadow-slate-200/50 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Account Overview</p>
                  <p className="mt-1 text-sm text-slate-500">Your active admin identity and login-facing profile data.</p>
                </div>
                {isLoading ? (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">Refreshing...</span>
                ) : (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Live</span>
                )}
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <ProfileField label="Full Name" value={name} />
                <ProfileField label="Email Address" value={email} />
                <ProfileField label="Role" value={formatRole(role)} />
                <ProfileField label="Admin ID" value={adminMe?.id ? String(adminMe.id) : 'Session linked'} />
                <ProfileField label="Supplier Link" value={supplierId ? `Supplier #${supplierId}` : 'Not linked'} />
                <ProfileField label="Permission Count" value={userLevelId === 1 || role === 'super_admin' ? 'All areas' : String(visiblePermissionCards.length)} />
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,rgba(248,250,252,0.94))] p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Profile Picture</p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                  {isUploadingAvatar ? 'Uploading...' : isSavingAvatar ? 'Saving...' : 'Ready'}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-500">Upload a new admin avatar and use it across the admin header, sidebar, and profile page.</p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileChange}
              />

              <div className="mt-4 rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    {avatarUrl ? (
                      <Image src={avatarUrl} alt={name} fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${getRoleTone(role)} text-xl font-bold text-white`}>
                        {getInitials(name)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">Display photo</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Recommended: square image, clear face or brand avatar, and under 5MB.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar || isSavingAvatar}
                    className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {avatarUrl ? 'Change Picture' : 'Upload Picture'}
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={!avatarUrl || isUploadingAvatar || isSavingAvatar}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Quick Actions</p>
              <div className="mt-4 space-y-3">
                <Link
                  href="/admin/settings/security"
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Security Settings</p>
                    <p className="mt-1 text-xs text-slate-500">Review password and account protection settings.</p>
                  </div>
                  <span className="text-slate-400 transition group-hover:text-slate-700">→</span>
                </Link>
                <Link
                  href="/admin/settings/general"
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">General Settings</p>
                    <p className="mt-1 text-xs text-slate-500">Open your admin-side preferences and platform config.</p>
                  </div>
                  <span className="text-slate-400 transition group-hover:text-slate-700">→</span>
                </Link>
                <Link
                  href="/admin/settings/notifications"
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Notification Settings</p>
                    <p className="mt-1 text-xs text-slate-500">Manage how operational updates reach your account.</p>
                  </div>
                  <span className="text-slate-400 transition group-hover:text-slate-700">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Access Coverage</h2>
              <p className="mt-1 text-sm text-slate-500">The modules and tools currently available to this admin account.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {userLevelId === 1 || role === 'super_admin' ? 'All modules' : `${visiblePermissionCards.length} enabled`}
            </span>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {visiblePermissionCards.map((permission, index) => (
              <motion.div
                key={permission.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 + index * 0.04 }}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-sm font-semibold text-slate-800">{permission.label}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{permission.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-slate-900">Role Summary</h2>
          <p className="mt-1 text-sm text-slate-500">A quick readout of how this admin account is scoped inside the portal.</p>

          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Current Role</p>
              <p className="mt-2 text-base font-semibold text-slate-800">{formatRole(role)}</p>
              <p className="mt-1 text-sm text-slate-500">{describeAccess(role, userLevelId, visiblePermissionCards.length)}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Operational Scope</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>Admin portal access is active for this account.</li>
                <li>Permissions are sourced from the live admin identity endpoint.</li>
                <li>{supplierId ? `Linked to supplier ID ${supplierId}.` : 'No supplier binding is attached to this profile.'}</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Next Upgrade</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Next we can add editable profile details, password change actions, and recent admin activity on the same page.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
