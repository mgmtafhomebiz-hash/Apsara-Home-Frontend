'use client'

import { SortKey } from './types'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'cashBalance',     label: 'Cash Balance' },
  { key: 'pvBalance',       label: 'PV Balance'   },
  { key: 'lockedAmount',    label: 'Locked'        },
  { key: 'availableAmount', label: 'Available'     },
]

interface WalletCreditsToolbarProps {
  search:        string
  onSearch:      (v: string) => void
  tierFilter:    string
  onTierFilter:  (v: string) => void
  statusFilter:  string
  onStatusFilter:(v: string) => void
  sortKey:       SortKey
  onSortKey:     (v: SortKey) => void
}

export default function WalletCreditsToolbar({
  search, onSearch,
  tierFilter, onTierFilter,
  statusFilter, onStatusFilter,
  sortKey, onSortKey,
}: WalletCreditsToolbarProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm p-4 flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search member…"
          value={search}
          onChange={e => onSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 bg-slate-50 text-slate-700 placeholder-slate-400 transition"
        />
      </div>

      {/* Tier filter */}
      <select
        value={tierFilter}
        onChange={e => onTierFilter(e.target.value)}
        className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition"
      >
        {['All Tiers', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'].map(t => (
          <option key={t}>{t}</option>
        ))}
      </select>

      {/* Status filter */}
      <select
        value={statusFilter}
        onChange={e => onStatusFilter(e.target.value)}
        className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition"
      >
        {['All Status', 'Active', 'Inactive', 'Suspended'].map(s => (
          <option key={s}>{s}</option>
        ))}
      </select>

      {/* Sort */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
        {SORT_OPTIONS.map(o => (
          <button
            key={o.key}
            onClick={() => onSortKey(o.key)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              sortKey === o.key
                ? 'bg-white text-teal-700 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
