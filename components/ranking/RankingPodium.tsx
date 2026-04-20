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
    1: 'min-h-[23rem] sm:min-h-[26rem]',
    2: 'min-h-[20rem] sm:min-h-[23rem]',
    3: 'min-h-[18rem] sm:min-h-[21rem]',
  }[rank]

  const accent = {
    1: 'from-amber-300 via-yellow-400 to-orange-400',
    2: 'from-slate-300 via-slate-400 to-sky-400',
    3: 'from-orange-300 via-amber-400 to-rose-400',
  }[rank]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: rank * 0.08 }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col items-stretch"
    >
      <div className={`relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5 shadow-2xl backdrop-blur-xl ${heightClass}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-10 transition-opacity duration-300 group-hover:opacity-20`} />
        <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-white/80">
          Rank #{rank}
        </div>

        <div className="relative flex h-full flex-col justify-between gap-6">
          <div className="pt-7 text-center">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3.2, delay: rank * 0.2 }}
              className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-cyan-400 via-sky-500 to-violet-500 text-2xl font-black text-white shadow-[0_0_40px_rgba(34,211,238,0.22)]"
            >
              {getInitials(earner.name)}
            </motion.div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl">{medal.emoji}</span>
              <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200">
                Elite challenger
              </p>
            </div>

            <h3 className="mt-4 text-2xl font-black text-white">{earner.name}</h3>
            <p className="mt-1 text-sm text-slate-400">{earner.email}</p>

            <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Total Earnings</p>
              <p className="mt-2 text-4xl font-black text-white">{php(earner.earnings)}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Orders', value: earner.orders, color: 'text-cyan-200' },
              { label: 'Referrals', value: earner.referrals, color: 'text-violet-200' },
              { label: 'Tier', value: `#${rank}`, color: 'text-amber-200' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-center">
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
                <p className={`mt-1 text-lg font-black ${item.color}`}>{item.value}</p>
              </div>
            ))}
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

  const ordered: (TopEarner | undefined)[] = [top3[1], top3[0], top3[2]]

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">Victory Stage</p>
          <h2 className="mt-1 text-3xl font-black text-white sm:text-4xl">Hall of Fame</h2>
        </div>
        <p className="text-sm text-slate-400">Top 3 challengers currently leading the arena</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {ordered.map((earner) => {
          if (!earner) return null
          const rank = (earner === top3[0] ? 1 : earner === top3[1] ? 2 : 3) as 1 | 2 | 3
          return <PodiumCard key={earner.id} earner={earner} rank={rank} />
        })}
      </div>
    </div>
  )
}
