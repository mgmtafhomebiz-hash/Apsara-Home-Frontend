'use client'

import { MemberWallet, SortKey } from './types'

const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
  { key: 'cashBalance', label: 'Cash Balance' },
  { key: 'pvBalance', label: 'PV Balance' },
  { key: 'lockedAmount', label: 'Locked' },
  { key: 'availableAmount', label: 'Available' },
]

const TIER_OPTIONS = [
  'All Tiers',
  'Home Starter',
  'Home Builder',
  'Home Stylist',
  'Lifestyle Consultant',
  'Lifestyle Elite',
] as const

const STATUS_OPTIONS = [
  'All Status',
  'Active',
  'Pending',
  'Blocked',
] as const

type TierFilterValue = (typeof TIER_OPTIONS)[number] | MemberWallet['tier']
type StatusFilterValue = (typeof STATUS_OPTIONS)[number]

interface WalletCreditsToolbarProps {
  search: string
  onSearch: (v: string) => void
  tierFilter: TierFilterValue
  onTierFilter: (v: (typeof TIER_OPTIONS)[number]) => void
  statusFilter: StatusFilterValue
  onStatusFilter: (v: StatusFilterValue) => void
  sortKey: SortKey
  onSortKey: (v: SortKey) => void
}

export default function WalletCreditsToolbar({
  search,
  onSearch,
  tierFilter,
  onTierFilter,
  statusFilter,
  onStatusFilter,
  sortKey,
  onSortKey,
}: WalletCreditsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="relative min-w-[180px] flex-1">
        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search member..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search members by name or email"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
        />
      </div>

      <select
        value={tierFilter}
        onChange={(e) => onTierFilter(e.target.value as (typeof TIER_OPTIONS)[number])}
        aria-label="Filter wallet credits by tier"
        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
      >
        {TIER_OPTIONS.map((tier) => (
          <option key={tier}>{tier}</option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(e) => onStatusFilter(e.target.value as StatusFilterValue)}
        aria-label="Filter wallet credits by status"
        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
      >
        {STATUS_OPTIONS.map((status) => (
          <option key={status}>{status}</option>
        ))}
      </select>

      <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
        {SORT_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onSortKey(option.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              sortKey === option.key
                ? 'border border-slate-200 bg-white text-teal-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
