'use client'

import { motion } from 'framer-motion'
import { SortKey, TIERS } from './types'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'earnings',  label: 'Earnings'  },
  { key: 'orders',    label: 'Orders'    },
  { key: 'referrals', label: 'Referrals' },
]

const PERIODS = ['All Time', 'This Month', 'Last 30 Days', 'This Year']

interface TopEarnersToolbarProps {
  search: string
  onSearch: (v: string) => void
  tierFilter: string
  onTierFilter: (v: string) => void
  period: string
  onPeriod: (v: string) => void
  sortKey: SortKey
  onSortKey: (v: SortKey) => void
}

export default function TopEarnersToolbar({
  search, onSearch,
  tierFilter, onTierFilter,
  period, onPeriod,
  sortKey, onSortKey,
}: TopEarnersToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center gap-3 flex-wrap"
    >
      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search member or email..."
          value={search}
          onChange={e => onSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 dark:focus:ring-sky-400/40 dark:focus:border-sky-400 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition"
        />
        {search && (
          <button onClick={() => onSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Tier filter */}
      <select
        value={tierFilter}
        onChange={e => onTierFilter(e.target.value)}
        className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:focus:ring-sky-400/40 focus:border-sky-500 dark:focus:border-sky-400"
      >
        {TIERS.map(t => <option key={t}>{t}</option>)}
      </select>

      {/* Period filter */}
      <select
        value={period}
        onChange={e => onPeriod(e.target.value)}
        className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:focus:ring-sky-400/40 focus:border-sky-500 dark:focus:border-sky-400"
      >
        {PERIODS.map(p => <option key={p}>{p}</option>)}
      </select>

      {/* Sort toggle */}
      <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 gap-0.5">
        {SORT_OPTIONS.map(opt => (
          <button
            key={opt.key}
            onClick={() => onSortKey(opt.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              sortKey === opt.key
                ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-100'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
