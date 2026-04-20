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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-xl p-4 sm:p-6 hover:border-gray-600/80 transition-all duration-300 shadow-xl"
    >
      <div className="flex flex-col gap-4">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-sky-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400 group-hover:text-teal-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for top earners..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-sm bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200 backdrop-blur-sm"
            />
            {search && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSearch('')}
                className="absolute right-4 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Period Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 sm:items-center"
        >
          <div className="flex flex-wrap gap-2">
            {PERIODS.map((p, idx) => (
              <motion.button
                key={p.value}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPeriod(p.value)}
                className={`px-4 py-2.5 text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-200 backdrop-blur-sm whitespace-nowrap ${
                  period === p.value
                    ? 'bg-gradient-to-r from-teal-500 to-sky-500 text-white shadow-lg shadow-teal-500/50 border border-teal-400/50'
                    : 'bg-gray-700/40 text-gray-300 border border-gray-600/40 hover:bg-gray-600/60 hover:text-white hover:border-gray-500/60'
                }`}
              >
                {p.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
