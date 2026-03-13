'use client'

import { usePathname } from 'next/navigation'
import SupplierLayoutShell from '@/components/supplier/SupplierLayoutShell'

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/supplier/login') {
    return <>{children}</>
  }

  return <SupplierLayoutShell>{children}</SupplierLayoutShell>
}
