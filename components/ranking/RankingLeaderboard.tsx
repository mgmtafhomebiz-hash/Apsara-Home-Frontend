'use client'

import { motion } from 'framer-motion'
import { TopEarner, php, getInitials } from '@/components/superAdmin/members/topEarners/types'

interface RankingLeaderboardProps {
  earners: TopEarner[]
  startRank: number
  getMovement: (currentRank: number, earnerId: number) => string
}

const AVATAR_COLORS = [
  'linear-gradient(135deg, #8B5CF6, #7C3AED)',
  'linear-gradient(135deg, #F472B6, #EC4899)',
  'linear-gradient(135deg, #FBBF24, #F59E0B)',
  'linear-gradient(135deg, #34D399, #10B981)',
]

const rankTone = (rank: number): { bg: string; text: string; border: string } => {
  if (rank <= 10) return { bg: '#FBBF2420', text: '#92400E', border: '#FBBF24' }
  if (rank <= 25) return { bg: '#8B5CF620', text: '#5B21B6', border: '#8B5CF6' }
  if (rank <= 50) return { bg: '#F472B620', text: '#9D174D', border: '#F472B6' }
  return { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' }
}

function MovementIndicator({ movement }: { movement: string }) {
  const isUp = movement.startsWith('UP')
  const isDown = movement.startsWith('DOWN')
  const delta = parseInt(movement.split(' ')[1] ?? '0', 10)

  if (!isUp && !isDown) {
    return (
      <div className="flex flex-col items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.25, ease: 'easeInOut' }}
            className="h-1.5 w-1.5 rounded-full bg-slate-400"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-0.5">
      <motion.div
        animate={isUp ? { y: [3, -5, 3] } : { y: [-3, 5, -3] }}
        transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
      >
        {isUp ? (
          <svg className="h-5 w-5" fill="#34D399" viewBox="0 0 24 24">
            <path d="M12 4l8 8H4z" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="#F472B6" viewBox="0 0 24 24">
            <path d="M12 20l-8-8h16z" />
          </svg>
        )}
      </motion.div>
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.6, delay: 0.15 }}
        className="text-[10px] font-black tabular-nums"
        style={{ color: isUp ? '#059669' : '#DB2777' }}
      >
        {isUp ? `+${delta}` : `-${delta}`}
      </motion.span>
    </div>
  )
}

export default function RankingLeaderboard({ earners, startRank, getMovement }: RankingLeaderboardProps) {
  const maxEarnings = earners[0]?.earnings ?? 1

  return (
    <div
      className="overflow-hidden rounded-2xl border-2 bg-white"
      style={{ borderColor: '#1E293B', boxShadow: '8px 8px 0px #E2E8F0' }}
    >
      {/* Header */}
      <div
        className="border-b-2 px-5 py-4 sm:px-6"
        style={{ borderColor: '#1E293B', backgroundColor: '#FFFDF5' }}
      >
        <h2
          className="text-xl font-extrabold"
          style={{ fontFamily: '"Outfit", system-ui, sans-serif', color: '#1E293B' }}
        >
          🎯 Rankings
        </h2>
      </div>

      <div className="divide-y-2" style={{ borderColor: '#E2E8F0' }}>
        {earners.map((earner, index) => {
          const rank = startRank + index
          const pct = (earner.earnings / maxEarnings) * 100
          const movement = getMovement(rank, earner.id)
          const tone = rankTone(rank)
          const avatarGrad = AVATAR_COLORS[index % AVATAR_COLORS.length]

          return (
            <motion.div
              key={earner.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04, duration: 0.35, type: 'spring', bounce: 0.3 }}
              whileHover={{
                x: 6,
                backgroundColor: '#FFFDF5',
                transition: { type: 'spring', stiffness: 400, damping: 15 },
              }}
              className="relative px-5 py-4 sm:px-6"
              style={{ backgroundColor: '#fff' }}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Rank badge */}
                <div
                  className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border-2 text-center"
                  style={{ backgroundColor: tone.bg, borderColor: tone.border, color: tone.text }}
                >
                  <p className="text-[9px] font-black uppercase opacity-70">Rank</p>
                  <p className="text-sm font-black">#{rank}</p>
                </div>

                {/* Movement */}
                <div className="flex h-10 w-8 shrink-0 items-center justify-center">
                  <MovementIndicator movement={movement} />
                </div>

                {/* Avatar + name */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-black text-white"
                    style={{ background: avatarGrad, borderColor: '#1E293B', boxShadow: '2px 2px 0px #1E293B' }}
                  >
                    {getInitials(earner.name)}
                  </motion.div>
                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-bold"
                      style={{ fontFamily: '"Outfit", system-ui, sans-serif', color: '#1E293B' }}
                    >
                      {earner.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">{earner.email}</p>
                  </div>
                </div>

                {/* Earnings bar */}
                <div className="hidden min-w-[100px] sm:block">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Earnings</p>
                  <p className="mt-0.5 text-sm font-black" style={{ color: '#8B5CF6' }}>{php(earner.earnings)}</p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.9, delay: index * 0.05, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #8B5CF6, #F472B6)' }}
                    />
                  </div>
                </div>

                {/* Orders */}
                <div className="hidden min-w-[60px] sm:block text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Orders</p>
                  <p className="mt-0.5 text-sm font-black" style={{ color: '#1E293B' }}>{earner.orders}</p>
                </div>

                {/* Tier badge */}
                <div
                  className="hidden shrink-0 rounded-full border-2 px-3 py-1 text-xs font-bold lg:block"
                  style={{ borderColor: '#1E293B', backgroundColor: '#FBBF2420', color: '#1E293B', boxShadow: '2px 2px 0px #1E293B' }}
                >
                  {earner.tier}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
