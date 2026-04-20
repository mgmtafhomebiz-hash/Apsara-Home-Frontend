'use client'

import { motion } from 'framer-motion'
import { TopEarner, php, getInitials } from '@/components/superAdmin/members/topEarners/types'

interface RankingLeaderboardProps {
  earners: TopEarner[]
  startRank: number
}

export default function RankingLeaderboard({ earners, startRank }: RankingLeaderboardProps) {
  const maxEarnings = earners[0]?.earnings ?? 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Leaderboard</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Rankings #{startRank} and beyond</p>
      </div>

      {/* Leaderboard */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {earners.map((earner, index) => {
          const rank = startRank + index
          const pct = maxEarnings > 0 ? (earner.earnings / maxEarnings) * 100 : 0

          return (
            <motion.div
              key={earner.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors px-6 py-4"
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex-shrink-0 w-8 text-center">
                  <span className="text-lg font-bold text-gray-400 dark:text-gray-500">#{rank}</span>
                </div>

                {/* Member Info */}
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-sky-600 flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(earner.name)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{earner.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{earner.email}</p>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex gap-6 items-center">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Orders</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">{earner.orders}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Referrals</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">{earner.referrals}</p>
                  </div>

                  {/* Earnings bar */}
                  <div className="w-32">
                    <div className="flex items-baseline gap-2 mb-1">
                      <p className="text-xs font-bold text-teal-700 dark:text-teal-300 min-w-fit">{php(earner.earnings)}</p>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.1 + index * 0.05, duration: 0.8 }}
                        className="h-full rounded-full bg-gradient-to-r from-teal-400 to-sky-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile view - Earnings */}
                <div className="sm:hidden text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Earnings</p>
                  <p className="text-sm font-bold text-teal-700 dark:text-teal-300">{php(earner.earnings)}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Footer stats */}
      <div className="bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
        <span>Showing {earners.length} members</span>
        <span className="font-semibold">
          Total Earnings:{' '}
          <span className="text-teal-600 dark:text-teal-400">
            {php(earners.reduce((sum, e) => sum + e.earnings, 0))}
          </span>
        </span>
      </div>
    </motion.div>
  )
}
