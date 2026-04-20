'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import RankingPodium from './RankingPodium'
import RankingLeaderboard from './RankingLeaderboard'
import RankingFilters from './RankingFilters'
import { MOCK_EARNERS } from '@/components/superAdmin/members/topEarners/types'

const PREVIOUS_RANKS: Record<number, number> = {
  1: 2, 2: 1, 3: 4, 4: 3, 5: 7,
  6: 5, 7: 8, 8: 6, 9: 11, 10: 9,
  11: 12, 12: 10,
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

  const getMovement = (currentRank: number, earnerId: number) => {
    const previousRank = PREVIOUS_RANKS[earnerId] ?? currentRank
    const delta = previousRank - currentRank
    if (delta > 0) return `UP ${delta}`
    if (delta < 0) return `DOWN ${Math.abs(delta)}`
    return 'SAME'
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: '#FFFDF5', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}
    >
      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(#1E293B 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.06,
        }}
      />

      {/* Floating decorative shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top-left violet circle */}
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute -left-16 -top-16 h-64 w-64 rounded-full border-4 border-[#8B5CF6]"
          style={{ backgroundColor: '#8B5CF620' }}
        />
        {/* Top-right yellow blob */}
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 1 }}
          className="absolute -right-20 -top-10 h-56 w-56 rounded-full"
          style={{ backgroundColor: '#FBBF2430', border: '4px solid #FBBF24' }}
        />
        {/* Bottom-left pink triangle */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          className="absolute bottom-24 left-8 h-16 w-16"
          style={{
            background: '#F472B6',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            opacity: 0.5,
          }}
        />
        {/* Mid-right emerald circle */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
          className="absolute right-10 top-1/3 h-20 w-20 rounded-full"
          style={{ backgroundColor: '#34D39940', border: '3px solid #34D399' }}
        />
        {/* Small violet square */}
        <motion.div
          animate={{ rotate: [0, 45, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="absolute bottom-40 right-24 h-10 w-10 rounded-md"
          style={{ backgroundColor: '#8B5CF650', border: '2px solid #8B5CF6' }}
        />
        {/* Pink dot cluster */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8 - i * 2, 0] }}
            transition={{ repeat: Infinity, duration: 3 + i * 0.4, ease: 'easeInOut', delay: i * 0.2 }}
            className="absolute h-3 w-3 rounded-full"
            style={{
              backgroundColor: ['#F472B6', '#FBBF24', '#8B5CF6', '#34D399', '#F472B6'][i],
              left: `${15 + i * 8}%`,
              bottom: `${10 + (i % 3) * 6}%`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-12 lg:py-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <p
              className="mb-1 text-xs font-bold uppercase tracking-[0.3em]"
              style={{ color: '#8B5CF6', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}
            >
              Live Ranking
            </p>
            <h1
              className="text-3xl font-extrabold sm:text-4xl"
              style={{ fontFamily: '"Outfit", system-ui, sans-serif', color: '#1E293B' }}
            >
              Realtime Leaderboard
            </h1>
            {/* Squiggle underline */}
            <svg className="mt-1" width="180" height="10" viewBox="0 0 180 10" fill="none">
              <path d="M0 5 Q22 0 45 5 Q68 10 90 5 Q112 0 135 5 Q158 10 180 5" stroke="#F472B6" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Live badge */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-2 rounded-full border-2 px-4 py-2 text-xs font-bold uppercase tracking-widest"
            style={{ borderColor: '#1E293B', backgroundColor: '#34D399', color: '#1E293B', boxShadow: '4px 4px 0px #1E293B' }}
          >
            <span className="h-2 w-2 rounded-full bg-[#1E293B]" />
            Live
          </motion.div>
        </motion.div>

        {/* Filters */}
        <div className="mb-6">
          <RankingFilters period={period} onPeriod={setPeriod} search={search} onSearch={setSearch} />
        </div>

        {/* Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', bounce: 0.3 }}
          className="mb-6"
        >
          {filtered.length > 0 ? (
            <RankingPodium top3={top3} />
          ) : (
            <div
              className="rounded-2xl border-2 py-16 text-center"
              style={{ borderColor: '#1E293B', backgroundColor: '#fff', boxShadow: '6px 6px 0px #1E293B' }}
            >
              <p className="text-lg font-bold" style={{ color: '#1E293B', fontFamily: '"Outfit", system-ui, sans-serif' }}>
                No challengers found
              </p>
            </div>
          )}
        </motion.div>

        {/* Leaderboard */}
        {remaining.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, type: 'spring', bounce: 0.3 }}
          >
            <RankingLeaderboard earners={remaining} startRank={4} getMovement={getMovement} />
          </motion.div>
        )}
      </div>
    </div>
  )
}
