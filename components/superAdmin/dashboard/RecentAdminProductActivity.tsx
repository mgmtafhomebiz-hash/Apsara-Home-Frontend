'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useGetAdminMeQuery } from '@/store/api/authApi'
import { useGetProductActivityLogsQuery } from '@/store/api/productsApi'

const formatActivityDate = (value?: string | null) => {
  if (!value) return 'Unknown time'

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'Unknown time'

  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(parsed)
}

const actionLabel = (action: string) => {
  switch (action) {
    case 'created':
      return 'Added'
    case 'updated':
      return 'Updated'
    case 'deleted':
      return 'Deleted'
    default:
      return action
  }
}

const actionTone = (action: string) => {
  switch (action) {
    case 'created':
      return 'text-emerald-700 bg-emerald-50 border-emerald-200'
    case 'updated':
      return 'text-amber-700 bg-amber-50 border-amber-200'
    case 'deleted':
      return 'text-red-700 bg-red-50 border-red-200'
    default:
      return 'text-slate-700 bg-slate-50 border-slate-200'
  }
}

const statusTone = (status: string) => {
  return status === 'failed'
    ? 'text-red-600 bg-red-50'
    : 'text-emerald-600 bg-emerald-50'
}

export default function RecentAdminProductActivity() {
  const [page, setPage] = useState(1)
  const { data: session } = useSession()
  const sessionRole = String(session?.user?.role ?? '').toLowerCase()
  const sessionAccessToken = String((session?.user as { accessToken?: string } | undefined)?.accessToken ?? '')
  const adminIdentityKey = sessionAccessToken
    ? `${String((session?.user as { id?: string } | undefined)?.id ?? 'unknown')}:${sessionAccessToken}`
    : undefined
  const { data: adminMe } = useGetAdminMeQuery(adminIdentityKey, { skip: !sessionAccessToken })
  const role = String(adminMe?.role ?? sessionRole).toLowerCase()
  const isSuperAdmin = role === 'super_admin'

  const { data, isLoading } = useGetProductActivityLogsQuery(
    { page, perPage: 8, scope: 'all' },
    { skip: !isSuperAdmin },
  )

  useEffect(() => {
    if (!isSuperAdmin && page !== 1) {
      setPage(1)
    }
  }, [isSuperAdmin, page])

  if (!isSuperAdmin) {
    return null
  }

  const logs = data?.logs ?? []
  const meta = data?.meta
  const currentPage = meta?.current_page ?? 1
  const lastPage = meta?.last_page ?? 1
  const total = meta?.total ?? logs.length

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Super Admin</p>
          <h2 className="mt-1 text-lg font-bold text-slate-900">Recent Admin Product Activity</h2>
          <p className="mt-1 text-sm text-slate-500">Latest product actions across admin accounts.</p>
        </div>
        <Link
          href="/admin/products"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-cyan-200 hover:text-cyan-700"
        >
          Open Products
        </Link>
      </div>

      <div className="px-6 py-5">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
            <p className="text-sm font-semibold text-slate-700">No admin product activity yet</p>
            <p className="mt-1 text-sm text-slate-500">New product uploads, edits, deletes, and failures will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="max-h-[30rem] space-y-3 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div key={log.id} className="rounded-2xl border border-slate-200 px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${actionTone(log.action)}`}>
                          {actionLabel(log.action)}
                        </span>
                        <p className="truncate text-sm font-semibold text-slate-800">{log.productName}</p>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ${statusTone(log.status)}`}>
                          {log.status}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span>{log.actorName?.trim() ? log.actorName : 'Unknown admin'}</span>
                        <span>{log.actorRole?.replace(/_/g, ' ') ?? 'admin'}</span>
                        <span>SKU: {log.productSku?.trim() ? log.productSku : 'N/A'}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-xs text-slate-400">
                      {formatActivityDate(log.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Page <span className="font-semibold text-slate-700">{currentPage}</span> of <span className="font-semibold text-slate-700">{lastPage}</span>
                {' '}· {total} total activities
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage <= 1}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-cyan-200 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((prev) => Math.min(lastPage, prev + 1))}
                  disabled={currentPage >= lastPage}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-cyan-200 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
