'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import RankingPodium from './RankingPodium'
import RankingLeaderboard from './RankingLeaderboard'
import RankingFilters from './RankingFilters'
import { MOCK_EARNERS, php } from '@/components/superAdmin/members/topEarners/types'

const periodLabels: Record<string, string> = {
  'all-time': 'All Time',
  'this-month': 'This Month',
  'last-30-days': 'Last 30 Days',
  'this-year': 'This Year',
}

export default function RankingPageClient() {
  const [period, setPeriod] = useState('all-time')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = [...MOCK_EARNERS]

    if (q) {
      list = list.filter((m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.tier.toLowerCase().includes(q)
      )
    }

    list.sort((a, b) => b.earnings - a.earnings)
    return list
  }, [search])

  const top3 = filtered.slice(0, 3)
  const remaining = filtered.slice(3)
  const totalEarnings = filtered.reduce((sum, item) => sum + item.earnings, 0)
  const topEarner = filtered[0]
  const totalOrders = filtered.reduce((sum, item) => sum + item.orders, 0)
  const totalReferrals = filtered.reduce((sum, item) => sum + item.referrals, 0)

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1a3b5d_0%,transparent_38%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.18),transparent_30%),linear-gradient(180deg,#09111d_0%,#07111f_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
      <div className="absolute -top-24 left-[-4rem] h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-8"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_34%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-200">
                Ranking Arena
              </span>
              <h1 className="mt-4 max-w-2xl text-4xl font-black leading-none sm:text-6xl">
                The leaderboard turns into a live battle for the crown.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Present top performers like champions, highlight momentum, and make the page feel like a tournament stage instead of a plain list.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Current Season</p>
                  <p className="mt-1 text-sm font-semibold text-white">{periodLabels[period] ?? 'All Time'}</p>
                </div>
                <div className="rounded-2xl border border-cyan-300/10 bg-cyan-400/10 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-200">Prize Pool</p>
                  <p className="mt-1 text-sm font-semibold text-white">{php(totalEarnings)}</p>
                </div>
                <div className="rounded-2xl border border-fuchsia-300/10 bg-fuchsia-400/10 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-fuchsia-200">Champions</p>
                  <p className="mt-1 text-sm font-semibold text-white">{filtered.length} contenders</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-emerald-300/15 bg-emerald-400/10 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Top Earner</p>
                <p className="mt-3 text-3xl font-black">{topEarner ? php(topEarner.earnings) : php(0)}</p>
                <p className="mt-2 text-sm text-emerald-50/80">{topEarner?.name ?? 'No champion yet'}</p>
              </div>
              <div className="rounded-[1.5rem] border border-sky-300/15 bg-sky-400/10 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-sky-200">Battle Score</p>
                <p className="mt-3 text-3xl font-black">{totalOrders}</p>
                <p className="mt-2 text-sm text-sky-50/80">Orders across the arena</p>
              </div>
              <div className="rounded-[1.5rem] border border-violet-300/15 bg-violet-400/10 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-violet-200">Referral Chain</p>
                <p className="mt-3 text-3xl font-black">{totalReferrals}</p>
                <p className="mt-2 text-sm text-violet-50/80">Allies brought into the guild</p>
              </div>
              <div className="rounded-[1.5rem] border border-amber-300/15 bg-amber-400/10 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-amber-200">Ranked Players</p>
                <p className="mt-3 text-3xl font-black">{filtered.length}</p>
                <p className="mt-2 text-sm text-amber-50/80">Visible in this bracket</p>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="mt-8 grid gap-6">
          <RankingFilters period={period} onPeriod={setPeriod} search={search} onSearch={setSearch} />

          {filtered.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="grid gap-4 sm:grid-cols-3"
            >
              {[
                { label: 'Players Loaded', value: String(filtered.length), tone: 'from-cyan-500/20 to-cyan-400/10 border-cyan-300/20' },
                { label: 'Average Earnings', value: php(Math.round(totalEarnings / filtered.length)), tone: 'from-violet-500/20 to-violet-400/10 border-violet-300/20' },
                { label: 'Winning Margin', value: topEarner ? php(topEarner.earnings - (filtered[1]?.earnings ?? 0)) : php(0), tone: 'from-amber-500/20 to-amber-400/10 border-amber-300/20' },
              ].map((card) => (
                <div key={card.label} className={`rounded-[1.5rem] border bg-white/5 p-5 backdrop-blur-xl ${card.tone}`}>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-300">{card.label}</p>
                  <p className="mt-3 text-2xl font-black text-white">{card.value}</p>
                </div>
              ))}
            </motion.section>
          )}

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
          >
            {filtered.length > 0 ? (
              <RankingPodium top3={top3} />
            ) : (
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 py-20 text-center backdrop-blur-xl">
                <p className="text-xl font-bold text-white">No challengers found</p>
                <p className="mt-2 text-sm text-slate-400">Try a different keyword or reset the season filter.</p>
              </div>
            )}
          </motion.section>

          {remaining.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
            >
              <RankingLeaderboard earners={remaining} startRank={4} />
            </motion.section>
          )}
        </div>
      </div>
    </div>
  )
}
