'use client'

import { motion } from 'framer-motion'
import { TopEarner, MEDALS, php, getInitials } from '@/components/superAdmin/members/topEarners/types'

interface PodiumCardProps {
  earner: TopEarner
  rank: 1 | 2 | 3
}

function PodiumCard({ earner, rank }: PodiumCardProps) {
  const medal = MEDALS[rank]
  const heightClass = {
    1: 'h-96',
    2: 'h-80',
    3: 'h-64',
  }[rank]

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1, duration: 0.5 }}
      className={`flex flex-col items-center`}
    >
      {/* Podium */}
      <div
        className={`w-full ${heightClass} rounded-t-3xl border-4 border-b-0 flex flex-col items-center justify-center p-6 transition-all duration-300 hover:shadow-2xl ${
          rank === 1
            ? 'bg-gradient-to-b from-yellow-100 to-yellow-50 dark:from-yellow-900/40 dark:to-yellow-800/20 border-yellow-300 dark:border-yellow-600'
            : rank === 2
              ? 'bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600 border-gray-300 dark:border-gray-500'
              : 'bg-gradient-to-b from-orange-100 to-orange-50 dark:from-orange-900/40 dark:to-orange-800/20 border-orange-300 dark:border-orange-600'
        }`}
      >
        {rank === 1 && (
          <div className="absolute -top-8 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold shadow-lg">
            TOP EARNER
          </div>
        )}

        {/* Avatar */}
        <div className="relative mb-4">
          <div
            className={`h-24 w-24 rounded-full flex items-center justify-center text-white font-bold text-2xl ${medal.bg} ${medal.ring} shadow-lg`}
          >
            {getInitials(earner.name)}
          </div>
          <span className="absolute -bottom-2 -right-2 text-5xl leading-none filter drop-shadow-lg">{medal.emoji}</span>
        </div>

        {/* Earnings */}
        <p className="text-xl font-bold text-gray-800 dark:text-white mb-1">{php(earner.earnings)}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Earnings</p>
      </div>

      {/* Base with info */}
      <div className="w-full bg-white dark:bg-gray-800 border-4 border-t-0 border-gray-200 dark:border-gray-700 rounded-b-2xl p-4 text-center">
        <p className="text-sm font-bold text-gray-800 dark:text-white mb-1">{earner.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 truncate">{earner.email}</p>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-2">
            <p className="text-gray-500 dark:text-gray-400 font-medium">Orders</p>
            <p className="text-sm font-bold text-gray-800 dark:text-white">{earner.orders}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-2">
            <p className="text-gray-500 dark:text-gray-400 font-medium">Referrals</p>
            <p className="text-sm font-bold text-gray-800 dark:text-white">{earner.referrals}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-2">
            <p className="text-gray-500 dark:text-gray-400 font-medium">Rank</p>
            <p className="text-sm font-bold text-gray-800 dark:text-white">#{rank}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface RankingPodiumProps {
  top3: TopEarner[]
}

export default function RankingPodium({ top3 }: RankingPodiumProps) {
  if (top3.length === 0) return null

  // Arrange: 2nd | 1st | 3rd for visual podium effect
  const ordered: (TopEarner | undefined)[] = [top3[1], top3[0], top3[2]]

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-12 text-center">Hall of Fame</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
        {ordered.map((earner, i) => {
          if (!earner) return null
          const rank = (earner === top3[0] ? 1 : earner === top3[1] ? 2 : 3) as 1 | 2 | 3
          return <PodiumCard key={earner.id} earner={earner} rank={rank} />
        })}
      </div>
    </div>
  )
}
