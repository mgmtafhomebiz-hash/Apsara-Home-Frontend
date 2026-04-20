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
  { value: 'last-30-days', label: 'Last 30 Days' },
  { value: 'this-year', label: 'This Year' },
]

export default function RankingFilters({ period, onPeriod, search, onSearch }: RankingFiltersProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 shadow-xl shadow-cyan-950/20 backdrop-blur-xl sm:p-5"
    >
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">Battle Controls</p>
          <h2 className="mt-1 text-lg font-bold text-white">Search the arena and switch the season bracket</h2>
        </div>
        <p className="text-sm text-slate-400">Use filters to spotlight the strongest contenders.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by name, email, or tier..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 py-3.5 pl-12 pr-12 text-sm text-white placeholder:text-slate-500 focus:border-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {PERIODS.map((item, index) => {
            const active = period === item.value
            return (
              <motion.button
                key={item.value}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.02 + index * 0.03 }}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onPeriod(item.value)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] transition ${
                  active
                    ? 'border border-cyan-300/30 bg-cyan-400/20 text-cyan-100 shadow-lg shadow-cyan-500/10'
                    : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
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
