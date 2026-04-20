'use client'

import { motion } from 'framer-motion'
import { TopEarner, php, getInitials } from '@/components/superAdmin/members/topEarners/types'

interface RankingLeaderboardProps {
  earners: TopEarner[]
  startRank: number
}

const rankTone = (rank: number) => {
  if (rank <= 10) return 'border-amber-300/20 bg-amber-400/10 text-amber-100'
  if (rank <= 25) return 'border-cyan-300/20 bg-cyan-400/10 text-cyan-100'
  if (rank <= 50) return 'border-violet-300/20 bg-violet-400/10 text-violet-100'
  return 'border-white/10 bg-white/5 text-slate-200'
}

export default function RankingLeaderboard({ earners, startRank }: RankingLeaderboardProps) {
  const maxEarnings = earners[0]?.earnings ?? 1
  const totalEarnings = earners.reduce((sum, item) => sum + item.earnings, 0)

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
      <div className="border-b border-white/10 px-5 py-5 sm:px-6">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">Leaderboard Raid</p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">Champions beyond the podium</h2>
            <p className="mt-1 text-sm text-slate-400">Ranks #{startRank} and beyond</p>
          </div>
          <div className="rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-sm text-slate-200">
            Total earnings: <span className="font-bold text-cyan-200">{php(totalEarnings)}</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-white/10">
        {earners.map((earner, index) => {
          const rank = startRank + index
          const pct = (earner.earnings / maxEarnings) * 100

          return (
            <motion.div
              key={earner.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03, duration: 0.35 }}
              whileHover={{ x: 6 }}
              className="group relative px-5 py-4 sm:px-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-white/0 to-violet-400/0 transition group-hover:from-cyan-400/10 group-hover:via-white/5 group-hover:to-violet-400/10" />
              <div className="relative grid gap-4 lg:grid-cols-[auto_1fr_auto_auto] lg:items-center">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${rankTone(rank)} text-center`}>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] opacity-80">Rank</p>
                    <p className="text-lg font-black">#{rank}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-black text-white shadow-lg shadow-cyan-500/20">
                    {getInitials(earner.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-white">{earner.name}</p>
                    <p className="truncate text-sm text-slate-400">{earner.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Earnings</p>
                    <p className="mt-1 text-sm font-bold text-cyan-200">{php(earner.earnings)}</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Orders</p>
                    <p className="mt-1 text-sm font-bold text-white">{earner.orders}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Referrals</p>
                    <p className="mt-1 text-sm font-bold text-white">{earner.referrals}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Spent</p>
                    <p className="mt-1 text-sm font-bold text-white">{php(earner.totalSpent)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-end">
                  <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
                    {earner.tier}
                  </p>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Status</p>
                    <p className="text-sm font-semibold text-slate-300">{earner.status}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
