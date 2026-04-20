'use client'

import { motion } from 'framer-motion'
import { TopEarner, php, getInitials } from '@/components/superAdmin/members/topEarners/types'

interface RankingLeaderboardProps {
  earners: TopEarner[]
  startRank: number
}

const getRankColor = (rank: number) => {
  if (rank <= 10) return 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-300'
  if (rank <= 25) return 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-300'
  if (rank <= 50) return 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-300'
  return 'from-gray-500/20 to-gray-600/10 border-gray-500/30 text-gray-300'
}

const getRankBadge = (rank: number) => {
  if (rank <= 10) return '⭐'
  if (rank <= 25) return '🔥'
  if (rank <= 50) return '📈'
  return '👤'
}

export default function RankingLeaderboard({ earners, startRank }: RankingLeaderboardProps) {
  const maxEarnings = earners[0]?.earnings ?? 1
  const totalEarnings = earners.reduce((sum, e) => sum + e.earnings, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-b from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl overflow-hidden hover:border-gray-600/80 transition-all duration-300 shadow-2xl"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-b border-gray-700/50 px-6 py-6">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-black text-white uppercase tracking-wider"
        >
          📊 Global Leaderboard
        </motion.h2>
        <p className="text-sm text-gray-400 mt-2">Ranks #{startRank} and beyond</p>
      </div>

      {/* Leaderboard */}
      <div className="divide-y divide-gray-700/30">
        {earners.map((earner, index) => {
          const rank = startRank + index
          const pct = maxEarnings > 0 ? (earner.earnings / maxEarnings) * 100 : 0
          const colorClass = getRankColor(rank)
          const badge = getRankBadge(rank)

          return (
            <motion.div
              key={earner.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03, duration: 0.4 }}
              whileHover={{ x: 8, backgroundColor: 'rgba(107, 114, 128, 0.1)' }}
              className="px-4 sm:px-6 py-4 transition-colors duration-200 group cursor-pointer relative"
            >
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 to-sky-500/0 group-hover:from-teal-500/5 group-hover:to-sky-500/5 transition-all duration-300" />

              <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                {/* Rank Badge */}
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className={`flex-shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center font-bold text-sm bg-gradient-to-br ${colorClass} backdrop-blur-sm`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-lg">{badge}</span>
                    <span className="text-[10px] font-black">#{rank}</span>
                  </div>
                </motion.div>

                {/* Member Info */}
                <div className="flex-shrink-0">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-sky-600 flex items-center justify-center text-white text-xs font-bold shadow-lg"
                  >
                    {getInitials(earner.name)}
                  </motion.div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate group-hover:text-teal-300 transition-colors">{earner.name}</p>
                  <p className="text-xs text-gray-400 truncate">{earner.email}</p>
                </div>

                {/* Stats - Hidden on mobile */}
                <div className="hidden sm:flex gap-4 items-center flex-shrink-0">
                  <motion.div whileHover={{ scale: 1.1 }} className="text-center">
                    <p className="text-xs text-gray-400 font-medium">Orders</p>
                    <p className="text-sm font-bold text-teal-300">{earner.orders}</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} className="text-center">
                    <p className="text-xs text-gray-400 font-medium">Referrals</p>
                    <p className="text-sm font-bold text-sky-300">{earner.referrals}</p>
                  </motion.div>

                  {/* Earnings bar */}
                  <div className="w-40">
                    <div className="flex items-baseline gap-2 mb-1">
                      <p className="text-xs font-bold text-purple-300 min-w-fit">{php(earner.earnings)}</p>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-700/60 overflow-hidden border border-gray-600/40">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.1 + index * 0.03, duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 via-purple-400 to-pink-400 shadow-lg shadow-purple-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile view - Earnings */}
                <div className="sm:hidden text-right flex-shrink-0">
                  <p className="text-xs text-gray-400 font-medium">Earnings</p>
                  <p className="text-sm font-bold text-purple-300">{php(earner.earnings)}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Footer stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-t border-gray-700/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
      >
        <div className="flex gap-4 text-center sm:text-left">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Members</p>
            <p className="text-lg font-black text-teal-300">{earners.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Avg Earnings</p>
            <p className="text-lg font-black text-sky-300">{php(totalEarnings / earners.length)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase font-bold">Total Earnings</p>
          <p className="text-lg font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {php(totalEarnings)}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
