'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import RankingPodium from './RankingPodium'
import RankingLeaderboard from './RankingLeaderboard'
import RankingFilters from './RankingFilters'
import { MOCK_EARNERS } from '@/components/superAdmin/members/topEarners/types'

export default function RankingPageClient() {
  const [period, setPeriod] = useState('all-time')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = [...MOCK_EARNERS]

    if (q) {
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
      )
    }

    list.sort((a, b) => b.earnings - a.earnings)
    return list
  }, [search])

  const top3 = filtered.slice(0, 3)
  const remaining = filtered.slice(3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Filters Section - Compact */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="mb-12"
        >
          <RankingFilters
            period={period}
            onPeriod={setPeriod}
            search={search}
            onSearch={setSearch}
          />
        </motion.div>

        {/* Stats Overview */}
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12"
          >
            <div className="bg-gradient-to-br from-teal-500/20 to-teal-600/10 border border-teal-500/30 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-xs text-teal-400 font-bold uppercase tracking-wider mb-1">Total Members</p>
              <p className="text-2xl font-bold text-white">{filtered.length}</p>
            </div>
            <div className="bg-gradient-to-br from-sky-500/20 to-sky-600/10 border border-sky-500/30 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-xs text-sky-400 font-bold uppercase tracking-wider mb-1">Total Earnings</p>
              <p className="text-lg font-bold text-white">
                ₱{(filtered.reduce((s, m) => s + m.earnings, 0) / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">Avg Earnings</p>
              <p className="text-lg font-bold text-white">
                ₱{Math.round(filtered.reduce((s, m) => s + m.earnings, 0) / filtered.length).toLocaleString()}
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-500/30 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-xs text-pink-400 font-bold uppercase tracking-wider mb-1">Top Earner</p>
              <p className="text-lg font-bold text-white">
                ₱{(filtered[0]?.earnings || 0).toLocaleString()}
              </p>
            </div>
          </motion.div>
        )}

        {/* Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          {filtered.length > 0 ? (
            <RankingPodium top3={top3} />
          ) : (
            <div className="text-center py-24">
              <p className="text-gray-400 text-lg font-semibold">No earners found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search</p>
            </div>
          )}
        </motion.div>

        {/* Leaderboard */}
        {remaining.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <RankingLeaderboard earners={remaining} startRank={4} />
          </motion.div>
        )}
      </div>
    </div>
  )
}
