'use client'

import { usePathname } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import DashboardLayout from '@/components/superAdmin/DashboardLayout'

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/partner/login') {
    return (
      <SessionProvider basePath="/api/admin/auth">
        {children}
      </SessionProvider>
    )
  }

  return (
    <SessionProvider basePath="/api/admin/auth">
      <DashboardLayout>{children}</DashboardLayout>
    </SessionProvider>
  )
}
