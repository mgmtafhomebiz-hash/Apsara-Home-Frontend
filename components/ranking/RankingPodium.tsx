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
    1: 'h-80 sm:h-96',
    2: 'h-72 sm:h-80',
    3: 'h-64 sm:h-72',
  }[rank]

  const glowColor = {
    1: 'from-yellow-500/50 to-amber-500/50',
    2: 'from-slate-400/40 to-slate-500/40',
    3: 'from-orange-400/40 to-amber-500/40',
  }[rank]

  const borderGlow = {
    1: 'border-yellow-400/60 shadow-2xl shadow-yellow-500/20',
    2: 'border-slate-300/60 shadow-2xl shadow-slate-400/20',
    3: 'border-orange-400/60 shadow-2xl shadow-orange-500/20',
  }[rank]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: rank * 0.15, duration: 0.6, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className="flex flex-col items-center cursor-pointer"
    >
      {/* Podium with glow */}
      <div className="relative w-full group">
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-t-3xl blur-2xl bg-gradient-to-b ${glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />

        <div
          className={`w-full ${heightClass} rounded-t-3xl border-4 border-b-0 flex flex-col items-center justify-center p-4 sm:p-6 backdrop-blur-sm transition-all duration-300 ${borderGlow} ${
            rank === 1
              ? 'bg-gradient-to-b from-yellow-900/40 to-yellow-800/20'
              : rank === 2
                ? 'bg-gradient-to-b from-slate-700/40 to-slate-600/20'
                : 'bg-gradient-to-b from-orange-900/40 to-orange-800/20'
          }`}
        >
          {/* Rank Badge - Animated */}
          {rank === 1 && (
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-8 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-black shadow-2xl shadow-yellow-500/50 uppercase tracking-widest"
            >
              🏆 Champion
            </motion.div>
          )}

          {/* Avatar with animation */}
          <motion.div
            className="relative mb-4"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, delay: rank * 0.2 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${
                rank === 1
                  ? 'from-yellow-400 to-amber-500'
                  : rank === 2
                    ? 'from-slate-300 to-slate-400'
                    : 'from-orange-400 to-amber-500'
              } blur opacity-50`}
            />
            <div
              className={`relative h-24 w-24 rounded-full flex items-center justify-center text-white font-black text-2xl ${medal.bg} ${medal.ring} shadow-2xl`}
            >
              {getInitials(earner.name)}
            </div>
            <motion.span
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: rank * 0.1 }}
              className="absolute -bottom-2 -right-2 text-5xl leading-none filter drop-shadow-2xl"
            >
              {medal.emoji}
            </motion.span>
          </motion.div>

          {/* Earnings with animated number */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: rank * 0.15 + 0.3, duration: 0.5 }}
            className="text-center"
          >
            <p className="text-2xl sm:text-3xl font-black text-white mb-1">₱{(earner.earnings / 1000).toFixed(0)}K</p>
            <p className={`text-xs font-bold uppercase tracking-widest ${
              rank === 1
                ? 'text-yellow-300'
                : rank === 2
                  ? 'text-slate-200'
                  : 'text-orange-300'
            }`}>
              Total Earnings
            </p>
          </motion.div>
        </div>
      </div>

      {/* Base with info */}
      <div className="w-full bg-gradient-to-b from-gray-800/80 to-gray-900/60 backdrop-blur-sm border-4 border-t-0 border-gray-700/60 rounded-b-2xl p-4 text-center hover:from-gray-800 hover:to-gray-900 transition-all duration-300">
        <p className="text-sm font-bold text-white mb-1 line-clamp-1">{earner.name}</p>
        <p className="text-xs text-gray-400 mb-3 line-clamp-1">{earner.email}</p>

        {/* Mini stats with icons */}
        <div className="grid grid-cols-3 gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-teal-500/20 to-teal-600/10 border border-teal-500/30 rounded-lg p-2 backdrop-blur-sm cursor-pointer"
          >
            <p className="text-[10px] text-teal-300 font-bold">Orders</p>
            <p className="text-sm font-black text-teal-100">{earner.orders}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-sky-500/20 to-sky-600/10 border border-sky-500/30 rounded-lg p-2 backdrop-blur-sm cursor-pointer"
          >
            <p className="text-[10px] text-sky-300 font-bold">Referrals</p>
            <p className="text-sm font-black text-sky-100">{earner.referrals}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-lg p-2 backdrop-blur-sm cursor-pointer"
          >
            <p className="text-[10px] text-purple-300 font-bold">Rank</p>
            <p className="text-sm font-black text-purple-100">#{rank}</p>
          </motion.div>
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
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl sm:text-4xl font-black text-white mb-12 text-center uppercase tracking-wider"
      >
        <span className="bg-gradient-to-r from-yellow-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">
          Hall of Fame
        </span>
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-end">
        {ordered.map((earner, i) => {
          if (!earner) return null
          const rank = (earner === top3[0] ? 1 : earner === top3[1] ? 2 : 3) as 1 | 2 | 3
          return <PodiumCard key={earner.id} earner={earner} rank={rank} />
        })}
      </div>
    </div>
  )
}
