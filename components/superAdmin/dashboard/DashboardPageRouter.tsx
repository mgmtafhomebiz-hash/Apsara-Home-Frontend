'use client'

import { useSession } from 'next-auth/react'
import AdminDashboardHome from './AdminDashboardHome'
import SupplierDashboardHome from './SupplierDashboardHome'

export default function DashboardPageRouter() {
  const { data: session } = useSession()
  const role = String(session?.user?.role ?? '').toLowerCase()
  const userLevelId = Number((session?.user as { userLevelId?: number } | undefined)?.userLevelId ?? 0)
  const isSupplierAdmin = role === 'supplier_admin' || userLevelId === 8

  if (isSupplierAdmin) {
    return <SupplierDashboardHome />
  }

  return <AdminDashboardHome />
}
