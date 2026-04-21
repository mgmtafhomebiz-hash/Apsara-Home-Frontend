'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useGetAdminEncashmentRequestsQuery } from '@/store/api/encashmentApi'

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 2,
  }).format(value || 0)

const formatDate = (value?: string | null) => {
  if (!value) return 'N/A'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return 'N/A'
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d)
}

const statusClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30'
    case 'on_hold':
      return 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
    case 'approved_by_admin':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30'
    case 'released':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30'
    case 'rejected':
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30'
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-800'
  }
}

export default function AccountingDashboardMain() {
  const { data, isLoading, isError } = useGetAdminEncashmentRequestsQuery({
    filter: 'all',
    page: 1,
    perPage: 40,
  })

  const summary = useMemo(() => {
    const rows = data?.requests ?? []
    const forApproval = rows.filter((r) => r.status === 'pending' || r.status === 'on_hold')
    const forRelease = rows.filter((r) => r.status === 'approved_by_admin')
    const released = rows.filter((r) => r.status === 'released')
    const rejected = rows.filter((r) => r.status === 'rejected')

    const channelTotal = rows.reduce(
      (acc, row) => {
        acc[row.channel] += row.amount
        return acc
      },
      { bank: 0, gcash: 0, maya: 0 },
    )

    const queue = [...forApproval, ...forRelease]
      .sort((a, b) => new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime())
      .slice(0, 8)

    return {
      totalCount: rows.length,
      totalAmount: rows.reduce((sum, row) => sum + row.amount, 0),
      forApprovalCount: forApproval.length,
      forApprovalAmount: forApproval.reduce((sum, row) => sum + row.amount, 0),
      forReleaseCount: forRelease.length,
      forReleaseAmount: forRelease.reduce((sum, row) => sum + row.amount, 0),
      releasedCount: released.length,
      releasedAmount: released.reduce((sum, row) => sum + row.amount, 0),
      rejectedCount: rejected.length,
      rejectedAmount: rejected.reduce((sum, row) => sum + row.amount, 0),
      channelTotal,
      queue,
    }
  }, [data?.requests])

  const pipelineTotal = Math.max(1, summary.totalCount)
  const approvalPct = Math.round((summary.forApprovalCount / pipelineTotal) * 100)
  const releasePct = Math.round((summary.forReleaseCount / pipelineTotal) * 100)
  const donePct = Math.round((summary.releasedCount / pipelineTotal) * 100)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Accounting Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Financial operations command center for approvals, releases, and payout risk monitoring.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Total Requests (Snapshot)</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{summary.totalCount}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{formatMoney(summary.totalAmount)}</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
            <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-300">For Approval</p>
            <p className="mt-1 text-2xl font-bold text-amber-800 dark:text-amber-300">{summary.forApprovalCount}</p>
            <p className="text-sm text-amber-700 dark:text-amber-300">{formatMoney(summary.forApprovalAmount)}</p>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/30 dark:bg-blue-500/10">
            <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-300">For Release</p>
            <p className="mt-1 text-2xl font-bold text-blue-800 dark:text-blue-300">{summary.forReleaseCount}</p>
            <p className="text-sm text-blue-700 dark:text-blue-300">{formatMoney(summary.forReleaseAmount)}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
            <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Released</p>
            <p className="mt-1 text-2xl font-bold text-emerald-800 dark:text-emerald-300">{summary.releasedCount}</p>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">{formatMoney(summary.releasedAmount)}</p>
          </div>
        </div>

        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Processing Pipeline</h2>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Auto-updated</span>
          </div>
          <div className="mt-4 space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>Waiting Approval</span>
                <span>{approvalPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${approvalPct}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>Ready to Release</span>
                <span>{releasePct}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${releasePct}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                <span>Completed</span>
                <span>{donePct}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${donePct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Quick Actions</h2>
            <Link href="/admin/encashment" className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300">
              Open Full Encashment Queue
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/encashment/pending"
              className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40"
            >
              Review Pending
            </Link>
            <Link
              href="/admin/encashment/approved_by_admin"
              className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40"
            >
              Process Releases
            </Link>
            <Link
              href="/admin/encashment/released"
              className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40"
            >
              View Released
            </Link>
            <Link
              href="/admin/encashment/rejected"
              className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40"
            >
              Audit Rejected
            </Link>
          </div>
        </div>

        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">Channel Mix</h2>
          <div className="space-y-2 text-sm">
            {[
              ['GCash', summary.channelTotal.gcash, 'bg-cyan-500'],
              ['Maya', summary.channelTotal.maya, 'bg-emerald-500'],
              ['Bank', summary.channelTotal.bank, 'bg-indigo-500'],
            ].map(([label, amount, color]) => (
              <div key={String(label)}>
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                  <span>{label}</span>
                  <span>{formatMoney(Number(amount))}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: `${Math.min(100, Math.round((Number(amount) / Math.max(1, summary.totalAmount)) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Priority Queue</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">Oldest requests first</span>
          </div>
        </div>

        {isError ? (
          <div className="p-4 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-500/10">Failed to load accounting queue.</div>
        ) : isLoading ? (
          <div className="p-4 space-y-2 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
        ) : summary.queue.length ? (
          <div className="overflow-auto">
            <table className="w-full min-w-245">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 dark:border-slate-800">
                <tr className="text-left text-xs text-slate-500 dark:text-slate-400">
                  <th className="px-4 py-2.5 font-semibold">Reference</th>
                  <th className="px-4 py-2.5 font-semibold">Affiliate</th>
                  <th className="px-4 py-2.5 font-semibold">Channel</th>
                  <th className="px-4 py-2.5 font-semibold">Amount</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                  <th className="px-4 py-2.5 font-semibold">Requested</th>
                  <th className="px-4 py-2.5 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {summary.queue.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 dark:border-slate-800 dark:border-slate-800/70 last:border-b-0 text-sm">
                    <td className="px-4 py-2.5 text-slate-800 dark:text-slate-100 font-medium">{row.reference_no}</td>
                    <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">{row.affiliate_name || 'Affiliate'}</td>
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400 uppercase">{row.channel}</td>
                    <td className="px-4 py-2.5 text-slate-800 dark:text-slate-100 font-semibold">{formatMoney(row.amount)}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(row.status)}`}>
                        {row.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{formatDate(row.created_at)}</td>
                    <td className="px-4 py-2.5">
                      <Link
                        href={row.status === 'approved_by_admin' ? '/admin/encashment/approved_by_admin' : '/admin/encashment/pending'}
                        className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 text-sm text-slate-500 dark:text-slate-400">No pending/release queue right now.</div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white">Risk and Exceptions</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">For finance audit</span>
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="rounded-xl border border-red-100 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-3 py-2.5">
            <p className="text-xs uppercase tracking-wide text-red-700 dark:text-red-300">Rejected Requests</p>
            <p className="mt-1 text-xl font-bold text-red-800 dark:text-red-300">{summary.rejectedCount}</p>
            <p className="text-red-700 dark:text-red-300">{formatMoney(summary.rejectedAmount)}</p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-3 py-2.5">
            <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400">On Hold Queue</p>
            <p className="mt-1 text-xl font-bold text-slate-800 dark:text-white">
              {summary.queue.filter((r) => r.status === 'on_hold').length}
            </p>
            <p className="text-slate-600 dark:text-slate-400">Needs manual review</p>
          </div>
          <div className="rounded-xl border border-emerald-100 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2.5">
            <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Release Throughput</p>
            <p className="mt-1 text-xl font-bold text-emerald-800 dark:text-emerald-300">{donePct}%</p>
            <p className="text-emerald-700 dark:text-emerald-300">Completion ratio</p>
          </div>
        </div>
      </div>
    </div>
  )
}
