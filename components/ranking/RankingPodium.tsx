'use client'

import { motion } from 'framer-motion'
import { TopEarner, MEDALS, php, getInitials } from '@/components/superAdmin/members/topEarners/types'

interface PodiumCardProps {
  earner: TopEarner
  rank: 1 | 2 | 3
}

const RANK_STYLES = {
  1: {
    shadowColor: '#FBBF24',
    avatarBg: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
    accentBg: '#FBBF2415',
    badge: '#FBBF24',
    badgeText: '#1E293B',
    label: '1st Place',
    height: 'min-h-[22rem]',
  },
  2: {
    shadowColor: '#8B5CF6',
    avatarBg: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
    accentBg: '#8B5CF615',
    badge: '#8B5CF6',
    badgeText: '#fff',
    label: '2nd Place',
    height: 'min-h-[19rem]',
  },
  3: {
    shadowColor: '#F472B6',
    avatarBg: 'linear-gradient(135deg, #F472B6, #EC4899)',
    accentBg: '#F472B615',
    badge: '#F472B6',
    badgeText: '#fff',
    label: '3rd Place',
    height: 'min-h-[18rem]',
  },
}

function PodiumCard({ earner, rank }: PodiumCardProps) {
  const medal = MEDALS[rank]
  const style = RANK_STYLES[rank]

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: rank * 0.1, type: 'spring', bounce: 0.45 }}
      whileHover={{
        y: -8,
        rotate: rank === 2 ? -1.5 : rank === 3 ? 1.5 : 0,
        transition: { type: 'spring', stiffness: 300, damping: 12 },
      }}
      className={`relative flex flex-col ${style.height}`}
    >
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border-2 bg-white p-5"
        style={{
          borderColor: '#1E293B',
          boxShadow: `6px 6px 0px ${style.shadowColor}`,
          backgroundColor: style.accentBg,
        }}
      >
        {/* Decorative dot pattern top-right */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-24 w-24 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#1E293B 1.5px, transparent 1.5px)',
            backgroundSize: '10px 10px',
          }}
        />

        {/* Rank badge */}
        <div
          className="absolute left-4 top-4 rounded-full border-2 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]"
          style={{ borderColor: '#1E293B', backgroundColor: style.badge, color: style.badgeText, boxShadow: '2px 2px 0px #1E293B' }}
        >
          {style.label}
        </div>

        {/* Content */}
        <div className="relative flex h-full flex-col items-center justify-between pt-10 text-center">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, delay: rank * 0.3, ease: 'easeInOut' }}
              className="mb-3 flex h-20 w-20 items-center justify-center rounded-full border-2 text-xl font-black text-white"
              style={{ background: style.avatarBg, borderColor: '#1E293B', boxShadow: `3px 3px 0px ${style.shadowColor}` }}
            >
              {getInitials(earner.name)}
            </motion.div>

            <span className="mb-2 text-3xl">{medal.emoji}</span>

            <h3
              className="text-xl font-extrabold leading-tight"
              style={{ fontFamily: '"Outfit", system-ui, sans-serif', color: '#1E293B' }}
            >
              {earner.name}
            </h3>
            <p className="mt-0.5 text-xs font-medium text-slate-500">{earner.email}</p>
          </div>

          {/* Earnings box */}
          <div
            className="mt-4 w-full rounded-xl border-2 bg-white p-3"
            style={{ borderColor: '#1E293B', boxShadow: `3px 3px 0px ${style.shadowColor}` }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Total Earnings</p>
            <p
              className="mt-1 text-2xl font-black"
              style={{ fontFamily: '"Outfit", system-ui, sans-serif', color: '#1E293B' }}
            >
              {php(earner.earnings)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function RankingPodium({ top3 }: { top3: TopEarner[] }) {
  if (top3.length === 0) return null

  const ordered: (TopEarner | undefined)[] = [top3[1], top3[0], top3[2]]

  return (
    <div
      className="rounded-2xl border-2 bg-white p-5 sm:p-6"
      style={{ borderColor: '#1E293B', boxShadow: '8px 8px 0px #E2E8F0' }}
    >
      <div className="mb-5 flex items-center justify-between">
        <h2
          className="text-xl font-extrabold sm:text-2xl"
          style={{ fontFamily: '"Outfit", system-ui, sans-serif', color: '#1E293B' }}
        >
          🏆 Top 3
        </h2>
        <div
          className="flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
          style={{ borderColor: '#34D399', backgroundColor: '#34D39920', color: '#065F46' }}
        >
          <motion.span
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-2 w-2 rounded-full bg-[#34D399]"
          />
          Live
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
        {ordered.map((earner) => {
          if (!earner) return null
          const rank = (earner === top3[0] ? 1 : earner === top3[1] ? 2 : 3) as 1 | 2 | 3
          return <PodiumCard key={earner.id} earner={earner} rank={rank} />
        })}
      </div>
    </div>
  )
}
