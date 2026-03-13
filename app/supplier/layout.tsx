'use client'

import { usePathname } from 'next/navigation'
import SupplierLayoutShell from '@/components/supplier/SupplierLayoutShell'

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (
    pathname === '/supplier/login' ||
    pathname === '/supplier/forgot-password' ||
    pathname === '/supplier/reset-password'
  ) {
    return <>{children}</>
  }

  return <SupplierLayoutShell>{children}</SupplierLayoutShell>
}
