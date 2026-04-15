'use client'

import { Card } from '@heroui/react'
import { MembersStatsResponse } from '@/store/api/membersApi'
import { motion } from 'framer-motion'

interface MembersStatsProps {
  stats?: MembersStatsResponse
  onTotalEarningsClick?: () => void
}

export default function MembersStats({ stats, onTotalEarningsClick }: MembersStatsProps) {
  const cards = [
    {
      label: 'Total Members',
      value: stats ? stats.total.toLocaleString() : '-',
      bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', val: 'text-slate-800',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: 'Active',
      value: stats ? stats.active.toLocaleString() : '-',
      bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', val: 'text-emerald-700',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Pending / KYC',
      value: stats ? stats.pending.toLocaleString() : '-',
      bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', val: 'text-amber-700',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Blocked',
      value: stats ? stats.blocked.toLocaleString() : '-',
      bg: 'bg-red-50', text: 'text-red-500', border: 'border-red-100', val: 'text-red-700',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
    },
    {
      label: 'New This 7 Days',
      value: stats ? stats.newMembers.toLocaleString() : '-',
      bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', val: 'text-blue-700',
      sub: 'Recently registered',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      label: 'Total Spent',
      value: stats ? `PHP ${stats.totalSpent.toLocaleString()}` : '-',
      bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100', val: 'text-teal-700',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Total Earnings',
      value: stats ? `PHP ${stats.totalEarnings.toLocaleString()}` : '-',
      bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-100', val: 'text-cyan-700',
      key: 'total_earnings',
      sub: 'Click to trace earners',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      label: 'Total Referrals',
      value: stats ? stats.totalReferrals.toLocaleString() : '-',
      bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', val: 'text-indigo-700',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {cards.map((card, index) => {
        const isEarnings = card.key === 'total_earnings'
        const inner = (
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{card.label}</p>
              <p className={`mt-2 text-2xl font-bold ${card.val}`}>{card.value}</p>
              {card.sub ? <p className="mt-0.5 text-[11px] text-slate-400">{card.sub}</p> : null}
            </div>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.bg} ${card.text}`}>
              {card.icon}
            </div>
          </div>
        )

        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <Card className={`h-full border ${card.border} bg-white shadow-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm`}>
              <Card.Content className="p-4">
                {isEarnings ? (
                  <button
                    type="button"
                    onClick={onTotalEarningsClick}
                    disabled={!onTotalEarningsClick}
                    className="w-full text-left disabled:cursor-default"
                  >
                    {inner}
                  </button>
                ) : inner}
              </Card.Content>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
