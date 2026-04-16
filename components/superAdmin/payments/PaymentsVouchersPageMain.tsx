'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useGetAdminPaymentsOverviewQuery } from '@/store/api/adminPaymentsApi'

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
  if (normalized === 'active') return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  if (normalized === 'redeemed') return 'border-sky-200 bg-sky-50 text-sky-700'
  if (normalized === 'expired') return 'border-amber-200 bg-amber-50 text-amber-700'
  if (normalized === 'cancelled') return 'border-rose-200 bg-rose-50 text-rose-700'
  return 'border-slate-200 bg-slate-50 text-slate-600'
}

export default function PaymentsVouchersPageMain() {
  const { data, isLoading, isFetching, isError } = useGetAdminPaymentsOverviewQuery()

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
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
          <h1 className="text-xl font-bold text-slate-900">Vouchers</h1>
          <p className="mt-1 text-sm text-slate-500">
            Current admin view for affiliate voucher issuance and voucher usage tied to checkout.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/payments" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700">
            Back to Payments
          </Link>
          <Link href="/admin/encashment" className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-100">
            Open Encashment
          </Link>
        </div>
      </motion.div>

      {isFetching ? <div className="google-loading-bar" /> : null}

      {isError || !data ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Failed to load voucher data.
        </div>
      ) : !data.voucher_summary.available ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-bold text-amber-900">Voucher table not available yet</h2>
          <p className="mt-2 text-sm leading-6 text-amber-800">
            The checkout flow is ready for vouchers, but the affiliate voucher issuance table is not available in this environment yet.
          </p>
        </div>
      ) : (
        <>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                Total Issued
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-900">{data.voucher_summary.total_issued.toLocaleString()}</p>
              <p className="mt-1 text-sm text-slate-500">All recorded affiliate vouchers</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
              <div className="inline-flex rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                Active
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-900">{data.voucher_summary.active.toLocaleString()}</p>
              <p className="mt-1 text-sm text-slate-500">{formatMoney(data.voucher_summary.reserved_value)} reserved voucher value</p>
            </div>
            <div className="rounded-2xl border border-sky-200 bg-white p-4 shadow-sm">
              <div className="inline-flex rounded-xl border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700">
                Redeemed
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-900">{data.voucher_summary.redeemed.toLocaleString()}</p>
              <p className="mt-1 text-sm text-slate-500">Applied and consumed by checkout activity</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
              <div className="inline-flex rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                Expired
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-900">{data.voucher_summary.expired.toLocaleString()}</p>
              <p className="mt-1 text-sm text-slate-500">Issued value {formatMoney(data.voucher_summary.issued_value)}</p>
            </div>
          </motion.div>

          <div className="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
            <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Recent Voucher Issuances</h2>
                  <p className="mt-1 text-xs text-slate-400">Pulled from the current affiliate voucher issuance table</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      {['Code', 'Issuer', 'Amount', 'Usage', 'Status', 'Dates'].map((label) => (
                        <th key={label} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.recent_vouchers.length ? data.recent_vouchers.map((voucher) => (
                      <tr key={voucher.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-semibold text-slate-800">{voucher.code}</p>
                          <p className="mt-0.5 text-xs text-slate-400">ID #{voucher.id}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-semibold text-slate-800">{voucher.issuer_name}</p>
                          <p className="mt-0.5 text-xs text-slate-400">{voucher.issuer_email || 'No email'}</p>
                        </td>
                        <td className="px-4 py-3.5 text-sm font-semibold text-slate-800">{formatMoney(voucher.amount)}</td>
                        <td className="px-4 py-3.5 text-sm text-slate-500">
                          {voucher.used_count}
                          {voucher.max_uses ? ` / ${voucher.max_uses}` : ''}
                          {voucher.redeemer_name ? ` • ${voucher.redeemer_name}` : ''}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${statusTone(voucher.status)}`}>
                            {voucher.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-500">
                          <p>{formatDateTime(voucher.created_at)}</p>
                          <p className="mt-0.5 text-xs text-slate-400">Expires {formatDateTime(voucher.expires_at)}</p>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">
                          No vouchers issued yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900">What This Page Represents</h2>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-800">Checkout Discount Source</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Checkout already validates and applies these vouchers before PayMongo session creation.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-800">Affiliate Benefit</p>
                  <p className="mt-1 text-sm text-slate-500">
                    These are closer to affiliate vouchers than traditional gift cards, so the UI now reflects that reality.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-800">Next Upgrade</p>
                  <p className="mt-1 text-sm text-slate-500">
                    If you want, the next step can be admin actions for issuing, deactivating, or searching vouchers directly here.
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
