'use client'

import { motion } from 'framer-motion'
import { TopEarner, TIER_COLORS, STATUS_CONFIG, MEDALS, php, getInitials } from './types'

interface PodiumCardProps {
  earner: TopEarner
  rank: 1 | 2 | 3
}

function PodiumCard({ earner, rank }: PodiumCardProps) {
  const medal  = MEDALS[rank]
  const tier   = TIER_COLORS[earner.tier] ?? 'bg-slate-100 text-slate-600 border-slate-200'
  const status = STATUS_CONFIG[earner.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.07 }}
      className={`relative bg-white rounded-2xl border shadow-sm p-5 flex flex-col items-center text-center ${
        rank === 1 ? 'border-yellow-200 shadow-yellow-100/60' : 'border-slate-100'
      }`}
    >
      {rank === 1 && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-sky-400 text-white text-[10px] font-bold shadow-sm tracking-wide whitespace-nowrap">
          TOP EARNER
        </div>
      )}

      {/* Avatar */}
      <div className="relative mb-3 mt-1">
        <div className={`h-14 w-14 rounded-full ${medal.bg} ${medal.ring} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
          {getInitials(earner.name)}
        </div>
        <span className="absolute -bottom-1 -right-1 text-xl leading-none">{medal.emoji}</span>
      </div>

      {/* Rank badge */}
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rank #{rank}</span>

      {/* Name & email */}
      <p className="text-sm font-bold text-slate-800 leading-tight mb-0.5">{earner.name}</p>
      <p className="text-xs text-slate-400 mb-2 truncate max-w-[160px]">{earner.email}</p>

      {/* Tier */}
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border mb-3 ${tier}`}>
        {earner.tier}
      </span>

      {/* Earnings highlight */}
      <div className="w-full rounded-xl bg-teal-50 border border-teal-100 py-2.5 px-3 mb-2">
        <p className="text-[10px] text-teal-600 font-medium mb-0.5">Total Earnings</p>
        <p className="text-lg font-bold text-teal-700">{php(earner.earnings)}</p>
      </div>

      {/* Mini stats */}
      <div className="w-full grid grid-cols-3 gap-1.5 text-center">
        <div className="rounded-lg bg-slate-50 border border-slate-100 py-1.5">
          <p className="text-[10px] text-slate-400">Orders</p>
          <p className="text-xs font-bold text-slate-700">{earner.orders}</p>
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-100 py-1.5">
          <p className="text-[10px] text-slate-400">Referrals</p>
          <p className="text-xs font-bold text-slate-700">{earner.referrals}</p>
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-100 py-1.5">
          <p className="text-[10px] text-slate-400">Status</p>
          <p className={`text-[10px] font-bold ${status.text}`}>{status.label}</p>
        </div>
      </div>
    </motion.div>
  )
}

interface TopEarnersPodiumProps {
  top3: TopEarner[]
}

export default function TopEarnersPodium({ top3 }: TopEarnersPodiumProps) {
  if (top3.length === 0) return null

  // Arrange: 2nd | 1st | 3rd for visual podium effect
  const ordered: (TopEarner | undefined)[] = [top3[1], top3[0], top3[2]]

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Podium</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ordered.map((earner, i) => {
          if (!earner) return null
          const rank = (earner === top3[0] ? 1 : earner === top3[1] ? 2 : 3) as 1 | 2 | 3
          return <PodiumCard key={earner.id} earner={earner} rank={rank} />
        })}
      </div>
    </motion.div>
  )
}
