'use client'

import { motion } from 'framer-motion'

interface RankingFiltersProps {
  period: string
  onPeriod: (period: string) => void
  search: string
  onSearch: (search: string) => void
}

const PERIODS = [
  { value: 'all-time', label: 'All Time' },
  { value: 'this-month', label: 'This Month' },
  { value: 'last-30-days', label: '30 Days' },
  { value: 'this-year', label: 'Year' },
]

const PERIOD_COLORS = ['#8B5CF6', '#F472B6', '#FBBF24', '#34D399']

export default function RankingFilters({ period, onPeriod, search, onSearch }: RankingFiltersProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: 'spring', bounce: 0.35 }}
      className="rounded-2xl border-2 bg-white p-4"
      style={{ borderColor: '#1E293B', boxShadow: '6px 6px 0px #1E293B' }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#8B5CF6' }}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full rounded-xl border-2 bg-white py-3 pl-12 pr-12 text-sm font-medium outline-none transition-all"
            style={{
              borderColor: '#E2E8F0',
              color: '#1E293B',
              fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#8B5CF6'
              e.currentTarget.style.boxShadow = '4px 4px 0px #8B5CF6'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border-2 bg-white transition-colors hover:bg-slate-100"
              style={{ borderColor: '#1E293B' }}
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Period pills */}
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {PERIODS.map((item, index) => {
            const active = period === item.value
            const color = PERIOD_COLORS[index]
            return (
              <motion.button
                key={item.value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 + index * 0.04, type: 'spring', bounce: 0.5 }}
                whileHover={{ y: -3, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                whileTap={{ scale: 0.93 }}
                type="button"
                onClick={() => onPeriod(item.value)}
                className="rounded-full border-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition-all"
                style={{
                  borderColor: '#1E293B',
                  backgroundColor: active ? color : '#fff',
                  color: active ? (color === '#FBBF24' ? '#1E293B' : '#fff') : '#1E293B',
                  boxShadow: active ? `3px 3px 0px #1E293B` : 'none',
                  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                }}
              >
                {item.label}
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
