'use client'

import { motion } from 'framer-motion'
import { TopEarner, php, getInitials } from '@/components/superAdmin/members/topEarners/types'

interface PodiumCardProps {
  earner: TopEarner
  rank: 1 | 2 | 3
  isActive?: boolean
}

const RANK_STYLES = {
  1: {
    shadowColor: '#FBBF24',
    avatarBg: 'linear-gradient(135deg, #FBBF24, #F59E0B)',
    accentBg: '#FBBF2415',
    badge: '#FBBF24',
    badgeText: '#1E293B',
    label: '1st Place',
    height: 'min-h-[32rem]',
    avatarSize: 'h-24 w-24 text-2xl',
    nameSize: 'text-xl',
  },
  2: {
    shadowColor: '#8B5CF6',
    avatarBg: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
    accentBg: '#8B5CF615',
    badge: '#8B5CF6',
    badgeText: '#fff',
    label: '2nd Place',
    height: 'min-h-[24rem]',
    avatarSize: 'h-20 w-20 text-xl',
    nameSize: 'text-base',
  },
  3: {
    shadowColor: '#F472B6',
    avatarBg: 'linear-gradient(135deg, #F472B6, #EC4899)',
    accentBg: '#F472B615',
    badge: '#F472B6',
    badgeText: '#fff',
    label: '3rd Place',
    height: 'min-h-[22rem]',
    avatarSize: 'h-20 w-20 text-xl',
    nameSize: 'text-base',
  },
}

const CROWN_SVG = (
  <motion.div
    animate={{ y: [0, -4, 0], rotate: [-3, 3, -3] }}
    transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
    className="mb-2 flex justify-center"
  >
    <svg width="48" height="38" viewBox="0 0 48 38" fill="none">
      <path d="M5 30h38l5-22-13 11L24 3 18 19 5 8z" fill="#FBBF24" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="5" cy="8" r="3.5" fill="#FDE68A" stroke="#1E293B" strokeWidth="1.5" />
      <circle cx="24" cy="3" r="3.5" fill="#FDE68A" stroke="#1E293B" strokeWidth="1.5" />
      <circle cx="43" cy="8" r="3.5" fill="#FDE68A" stroke="#1E293B" strokeWidth="1.5" />
      <rect x="5" y="30" width="38" height="6" rx="2.5" fill="#F59E0B" stroke="#1E293B" strokeWidth="1.5" />
    </svg>
  </motion.div>
)

const RIBBON_MEDAL_SVG = (colorLeft: string, colorRight: string, medalColor: string, number: string) => (
  <motion.div
    animate={{ rotate: [-5, 5, -5] }}
    transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
    className="mb-2 flex justify-center"
  >
    <svg width="44" height="64" viewBox="0 0 44 64" fill="none">
      {/* Clasp bar */}
      <rect x="8" y="0" width="28" height="8" rx="4" fill={medalColor} stroke="#1E293B" strokeWidth="1.5" />
      {/* Left ribbon strip — tapers to V point at (22,36) */}
      <path d="M8 8 L22 8 L22 36 L8 28 Z" fill={colorLeft} stroke="#1E293B" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Right ribbon strip — tapers to V point at (22,36) */}
      <path d="M22 8 L36 8 L36 28 L22 36 Z" fill={colorRight} stroke="#1E293B" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Medal circle */}
      <circle cx="22" cy="52" r="12" fill={medalColor} stroke="#1E293B" strokeWidth="2" />
      {/* Shine highlight */}
      <circle cx="17" cy="47" r="3.5" fill="#fff" opacity="0.25" />
      {/* Number */}
      <text x="22" y="57" textAnchor="middle" fill="#fff" fontWeight="900" fontSize="14" fontFamily="Outfit, system-ui">{number}</text>
    </svg>
  </motion.div>
)

function PodiumCard({ earner, rank, isActive }: PodiumCardProps) {
  const style = RANK_STYLES[rank]

  return (
    <motion.div
      layout
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
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border-2 p-5"
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

        {isActive && (
          <motion.div
            animate={{ opacity: [0.25, 0.95, 0.25] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              border: '2px solid #34D399',
              boxShadow: 'inset 0 0 0 2px rgba(52, 211, 153, 0.15)',
            }}
          />
        )}

        {/* Content */}
        <div className="relative flex h-full flex-col items-center justify-between pt-10 text-center">
          <div className="flex flex-col items-center">
            {/* Crown / Ribbon medal above avatar */}
            {rank === 1
              ? CROWN_SVG
              : rank === 2
                ? RIBBON_MEDAL_SVG('#A78BFA', '#7C3AED', '#8B5CF6', '2')
                : RIBBON_MEDAL_SVG('#FBCFE8', '#EC4899', '#F472B6', '3')
            }

            {/* Avatar */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, delay: rank * 0.3, ease: 'easeInOut' }}
              className={`flex shrink-0 items-center justify-center rounded-full border-2 font-black text-white ${style.avatarSize}`}
              style={{ background: style.avatarBg, borderColor: '#1E293B', boxShadow: `3px 3px 0px ${style.shadowColor}` }}
            >
              {getInitials(earner.name)}
            </motion.div>

            <h3
              className={`mt-3 font-extrabold leading-tight ${style.nameSize}`}
              style={{ fontFamily: '"Outfit", system-ui, sans-serif', color: '#1E293B' }}
            >
              {earner.name}
            </h3>
            <p className="mt-1 text-xs font-medium text-slate-500">{earner.email}</p>
          </div>

          {/* Earnings + Referrals box */}
          <div
            className="mt-4 w-full rounded-xl border-2 bg-white p-3"
            style={{ borderColor: '#1E293B', boxShadow: `3px 3px 0px ${style.shadowColor}` }}
          >
            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Total Earnings</p>
                <p
                  className="mt-1 truncate text-xl font-black"
                  style={{ fontFamily: '"Outfit", system-ui, sans-serif', color: '#1E293B' }}
                >
                  {php(earner.earnings)}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Referrals</p>
                <p
                  className="mt-1 text-xl font-black"
                  style={{ fontFamily: '"Outfit", system-ui, sans-serif', color: '#8B5CF6' }}
                >
                  {earner.referrals}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function RankingPodium({ top3, demoStep = 0 }: { top3: TopEarner[]; demoStep?: number }) {
  if (top3.length === 0) return null

  const ordered: (TopEarner | undefined)[] = [top3[1], top3[0], top3[2]]

  return (
    <div
      className="rounded-2xl border-2 bg-white p-5 sm:p-8"
      style={{ borderColor: '#1E293B', boxShadow: '8px 8px 0px #E2E8F0' }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2
          className="text-xl font-extrabold sm:text-2xl"
          style={{ fontFamily: '"Outfit", system-ui, sans-serif', color: '#1E293B' }}
        >
          Top 3
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
        {ordered.map((earner, index) => {
          if (!earner) return null
          const rank = (earner === top3[0] ? 1 : earner === top3[1] ? 2 : 3) as 1 | 2 | 3
          return (
            <PodiumCard
              key={earner.id}
              earner={earner}
              rank={rank}
              isActive={demoStep === 1 ? index === 0 : demoStep === 2 ? index === 1 : false}
            />
          )
        })}
      </div>
    </div>
  )
}
