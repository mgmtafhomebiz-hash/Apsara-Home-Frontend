'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useGetAdminPaymentsOverviewQuery } from '@/store/api/adminPaymentsApi'
import { useGetAdminAffiliateVouchersQuery } from '@/store/api/encashmentApi'

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

const getStatusStyles = (status: string) => {
  const normalized = String(status).toLowerCase()
  if (normalized === 'active') return { badge: 'border-emerald-200 bg-emerald-50 text-emerald-700', dot: 'bg-emerald-400' }
  if (normalized === 'redeemed') return { badge: 'border-sky-200 bg-sky-50 text-sky-700', dot: 'bg-sky-400' }
  if (normalized === 'expired') return { badge: 'border-amber-200 bg-amber-50 text-amber-700', dot: 'bg-amber-400' }
  return { badge: 'border-slate-200 bg-slate-50 text-slate-600', dot: 'bg-slate-400' }
}

export default function PaymentsVouchersPageMain() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'redeemed' | 'expired'>('all')
  const [page, setPage] = useState(1)

  const { data: paymentsData, isLoading: paymentsLoading, isFetching: paymentsFetching, isError: paymentsError } = useGetAdminPaymentsOverviewQuery()
  const { data: vouchersData, isLoading: vouchersLoading, isFetching: vouchersFetching, isError: vouchersError } = useGetAdminAffiliateVouchersQuery({
    page,
    per_page: 12,
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: search.trim() || undefined,
  })

  const isLoading = paymentsLoading || vouchersLoading
  const isFetching = paymentsFetching || vouchersFetching
  const isError = paymentsError || vouchersError

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Vouchers</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage and track affiliate voucher codes
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/payments" className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-100 transition hover:border-teal-300 dark:hover:border-teal-600 hover:text-teal-700 dark:hover:text-teal-400">
            Back to Payments
          </Link>
        </div>
      </motion.div>

      {isFetching ? <div className="google-loading-bar" /> : null}

      {isError ? (
        <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          Failed to load vouchers.
        </div>
      ) : (
        <>
          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
          >
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1) }}
                  placeholder="Search code, username, or email..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 dark:focus:ring-sky-400/40 dark:focus:border-sky-400 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value as any); setPage(1) }}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 dark:focus:ring-sky-400/40 dark:focus:border-sky-400"
              >
                <option value="all">All Vouchers</option>
                <option value="active">Active</option>
                <option value="redeemed">Redeemed</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-600 dark:text-gray-300">{vouchersData?.meta?.total ?? 0}</span> vouchers total
            </p>
          </motion.div>

          {/* Voucher Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-pulse" />
              ))}
            </div>
          ) : vouchersData?.data && vouchersData.data.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                <AnimatePresence>
                  {vouchersData.data.map((voucher) => {
                    const statusStyles = getStatusStyles(voucher.status)
                    return (
                      <motion.div
                        key={voucher.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition"
                      >
                        {/* Code */}
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Code</p>
                          <p className="text-lg font-bold text-gray-800 dark:text-white font-mono">{voucher.code}</p>
                        </div>

                        {/* Amount */}
                        <div className="mb-4 p-3 rounded-lg bg-gradient-to-br from-sky-50 to-teal-50 dark:from-sky-950/30 dark:to-teal-950/30">
                          <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wide">Amount</p>
                          <p className="text-2xl font-bold text-sky-700 dark:text-sky-300 mt-1">{formatMoney(voucher.amount)}</p>
                        </div>

                        {/* Status Badge */}
                        <div className="mb-4 flex items-center justify-between">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${statusStyles.badge}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${statusStyles.dot}`} />
                            {voucher.status}
                          </span>
                          {voucher.max_uses && (
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              {voucher.used_count ?? 0} / {voucher.max_uses}
                            </span>
                          )}
                        </div>

                        {/* Customer Info */}
                        <div className="mb-3 pb-3 border-t border-gray-200 dark:border-gray-700 pt-3">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Creator</p>
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{voucher.customer.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">@{voucher.customer.username}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{voucher.customer.email}</p>
                        </div>

                        {/* Dates */}
                        <div className="space-y-2 text-xs">
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">Created:</span> {formatDateTime(voucher.created_at)}
                            </p>
                          </div>
                          {voucher.expires_at && (
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Expires:</span> {formatDateTime(voucher.expires_at)}
                              </p>
                            </div>
                          )}
                          {voucher.redeemed_at && (
                            <div>
                              <p className="text-sky-600 dark:text-sky-400">
                                <span className="font-semibold">Redeemed:</span> {formatDateTime(voucher.redeemed_at)}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>

              {/* Pagination */}
              {vouchersData.meta && vouchersData.meta.last_page > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center justify-center gap-2"
                >
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 transition text-sm font-medium"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {vouchersData.meta.current_page} of {vouchersData.meta.last_page}
                  </span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= vouchersData.meta.last_page}
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 transition text-sm font-medium"
                  >
                    Next
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-12 text-center">
              <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">No vouchers found</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
