'use client'

import { useSession } from 'next-auth/react'
import { useGetAdminMeQuery } from '@/store/api/authApi'
import AdminDashboardHome from './AdminDashboardHome'
import SupplierDashboardHome from './SupplierDashboardHome'

export default function DashboardPageRouter() {
  const { data: session } = useSession()
  const sessionAccessToken = String((session?.user as { accessToken?: string } | undefined)?.accessToken ?? '')
  const adminIdentityKey = sessionAccessToken
    ? `${String((session?.user as { id?: string } | undefined)?.id ?? 'unknown')}:${sessionAccessToken}`
    : undefined
  const { data: adminMe, isLoading } = useGetAdminMeQuery(adminIdentityKey, { skip: !sessionAccessToken })
  const role = String(adminMe?.role ?? '').toLowerCase()
  const userLevelId = Number(adminMe?.user_level_id ?? 0)
  const isSupplierAdmin = role === 'supplier_admin' || userLevelId === 8

  if (sessionAccessToken && isLoading && !adminMe) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
        Loading dashboard...
      </div>
    )
  }

  if (isSupplierAdmin) {
    return <SupplierDashboardHome />
  }

  return <AdminDashboardHome />
}
