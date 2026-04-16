'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useGetAdminPaymentsOverviewQuery } from '@/store/api/adminPaymentsApi'
import { useGetAdminEncashmentRequestsQuery } from '@/store/api/encashmentApi'

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 2 }).format(value || 0)

const formatDateTime = (value?: string | null) => {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

const statusTone = (status: string) => {
  const normalized = String(status).toLowerCase()
  if (normalized === 'released') return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  if (['approved_by_admin', 'on_hold'].includes(normalized)) return 'border-blue-200 bg-blue-50 text-blue-700'
  if (normalized === 'pending') return 'border-amber-200 bg-amber-50 text-amber-700'
  if (normalized === 'rejected') return 'border-rose-200 bg-rose-50 text-rose-700'
  return 'border-slate-200 bg-slate-50 text-slate-600'
}

export default function PaymentsEwalletPageMain() {
  const overview = useGetAdminPaymentsOverviewQuery()
  const encashment = useGetAdminEncashmentRequestsQuery({ filter: 'all', page: 1, perPage: 8 })

  const isLoading = overview.isLoading || encashment.isLoading
  const hasError = overview.isError || encashment.isError

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-32 rounded-2xl border border-slate-200 bg-white shadow-sm" />
          ))}
        </div>
        <div className="h-96 rounded-3xl border border-slate-200 bg-white shadow-sm" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">E-Wallet</h1>
          <p className="mt-1 text-sm text-slate-500">
            Cash-out and wallet-related admin view powered by the current encashment workflow.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/encashment" className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-100">
            Open Encashment Queue
          </Link>
          <Link href="/admin/members/wallet" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700">
            Open Member Wallets
          </Link>
        </div>
      </motion.div>

      {overview.isFetching || encashment.isFetching ? <div className="google-loading-bar" /> : null}

      {hasError || !overview.data || !encashment.data ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Failed to load the e-wallet overview.
        </div>
      ) : (
        <>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
              <div className="inline-flex rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                Pending Payouts
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-900">{overview.data.encashment_summary.pending_requests.toLocaleString()}</p>
              <p className="mt-1 text-sm text-slate-500">Requests waiting for approval or release</p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
              <div className="inline-flex rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                Released Amount
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-900">{formatMoney(overview.data.encashment_summary.released_amount)}</p>
              <p className="mt-1 text-sm text-slate-500">{overview.data.encashment_summary.released_requests.toLocaleString()} released request(s)</p>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-white p-4 shadow-sm">
              <div className="inline-flex rounded-xl border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700">
                Wallet Touchpoints
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-900">{overview.data.encashment_summary.total_requests.toLocaleString()}</p>
              <p className="mt-1 text-sm text-slate-500">Total encashment records connected to wallet activity</p>
            </div>
          </motion.div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
            <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Recent Encashment Requests</h2>
                  <p className="mt-1 text-xs text-slate-400">These records drive the admin side of wallet release monitoring</p>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                  {encashment.data.requests.length} shown
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      {['Reference', 'Affiliate', 'Amount', 'Status', 'Wallet Check', 'Created'].map((label) => (
                        <th key={label} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {encashment.data.requests.length ? encashment.data.requests.map((request) => (
                      <tr key={request.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-semibold text-slate-800">{request.reference_no}</p>
                          <p className="mt-0.5 text-xs capitalize text-slate-400">{request.channel}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-semibold text-slate-800">{request.affiliate_name || 'Affiliate'}</p>
                          <p className="mt-0.5 text-xs text-slate-400">{request.affiliate_email || 'No email'}</p>
                        </td>
                        <td className="px-4 py-3.5 text-sm font-semibold text-slate-800">{formatMoney(request.amount)}</td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${statusTone(request.status)}`}>
                            {String(request.status).replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-500">
                          {formatMoney(request.wallet_available_amount ?? 0)}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-500">{formatDateTime(request.created_at)}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">
                          No encashment requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900">How This Connects</h2>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-800">Cash Ledger</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Wallet debits happen when encashment releases are finalized on the backend.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-800">Release Queue</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Accounting and finance already manage this through the existing encashment module.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-800">Member Wallets</p>
                  <p className="mt-1 text-sm text-slate-500">
                    The wallet master view still lives under Members, so this page acts as the finance-focused summary.
                  </p>
                </div>
              </div>
            </motion.section>
          </div>
        </>
      )}
    </div>
  )
}
