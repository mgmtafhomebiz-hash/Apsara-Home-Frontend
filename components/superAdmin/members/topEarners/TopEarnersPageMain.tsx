'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MOCK_EARNERS, SortKey } from './types'
import TopEarnersStats from './TopEarnersStats'
import TopEarnersPodium from './TopEarnersPodium'
import TopEarnersToolbar from './TopEarnersToolbar'
import TopEarnersTable from './TopEarnersTable'

export default function TopEarnersPageMain() {
  const [search,     setSearch]     = useState('')
  const [tierFilter, setTierFilter] = useState('All Tiers')
  const [period,     setPeriod]     = useState('All Time')
  const [sortKey,    setSortKey]    = useState<SortKey>('earnings')

  const sorted = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = [...MOCK_EARNERS]

    if (q) {
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
      )
    }
    if (tierFilter !== 'All Tiers') {
      list = list.filter(m => m.tier === tierFilter)
    }

    list.sort((a, b) => b[sortKey] - a[sortKey])
    return list
  }, [search, tierFilter, sortKey])

  const top3 = sorted.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-xl font-bold text-slate-800">Top Earners</h1>
          <p className="text-sm text-slate-500 mt-0.5">Members ranked by total commission earnings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow">
          <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </motion.div>

      <TopEarnersStats />

      <TopEarnersPodium top3={top3} />

      <TopEarnersToolbar
        search={search}       onSearch={setSearch}
        tierFilter={tierFilter} onTierFilter={setTierFilter}
        period={period}       onPeriod={setPeriod}
        sortKey={sortKey}     onSortKey={setSortKey}
      />

      <TopEarnersTable earners={sorted} sortKey={sortKey} />
    </div>
  )
}
