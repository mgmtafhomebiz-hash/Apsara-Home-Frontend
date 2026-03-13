'use client'

import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { clearAccessTokenCache } from '@/store/api/baseApi'
import SupplierSidebar from './SupplierSidebar'

export default function SupplierLayoutShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <div className="flex min-h-screen bg-slate-100">
      <SupplierSidebar className="hidden lg:flex" />

      {menuOpen && (
        <div className="fixed inset-0 z-20 bg-slate-900/40 lg:hidden" onClick={() => setMenuOpen(false)} />
      )}

      <div className={`fixed inset-y-0 left-0 z-30 w-72 bg-white transition-transform lg:hidden ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SupplierSidebar />
      </div>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-4 lg:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMenuOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">Supplier Workspace</p>
                <h1 className="text-sm font-semibold text-slate-900">{session?.user?.supplierName || session?.user?.name || 'Supplier Account'}</h1>
              </div>
            </div>

            <button
              onClick={async () => {
                clearAccessTokenCache()
                await signOut({ callbackUrl: '/supplier/login' })
              }}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
