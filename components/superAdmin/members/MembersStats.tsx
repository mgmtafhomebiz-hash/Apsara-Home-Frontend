'use client';

import { MembersStatsResponse } from "@/store/api/membersApi";
import { motion } from "framer-motion";

const MembersStats = ({ stats }: { stats?: MembersStatsResponse }) => {
    const cards = [
        {
            label: 'Total Members',
            value: stats ? stats.total.toLocaleString() : '—',
            color: 'text-slate-800',
            iconBg: 'bg-slate-700',
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            label: 'Active',
            value: stats ? stats.active.toLocaleString() : '—',
            color: 'text-emerald-700',
            iconBg: 'bg-emerald-500',
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: 'Pending / KYC',
            value: stats ? stats.pending.toLocaleString() : '—',
            color: 'text-amber-700',
            iconBg: 'bg-amber-500',
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: 'Blocked',
            value: stats ? stats.blocked.toLocaleString() : '—',
            color: 'text-red-700',
            iconBg: 'bg-red-500',
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
            ),
        },
        {
            label: 'Total Spent',
            value: stats ? `₱ ${stats.totalSpent.toLocaleString()}` : '—',
            color: 'text-teal-700',
            iconBg: 'bg-teal-500',
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: 'Total Earnings',
            value: stats ? `₱ ${stats.totalEarnings.toLocaleString()}` : '—',
            color: 'text-purple-700',
            iconBg: 'bg-purple-500',
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
        },
        {
            label: 'Total Referrals',
            value: stats ? stats.totalReferrals.toLocaleString() : '—',
            color: 'text-indigo-700',
            iconBg: 'bg-indigo-500',
            icon: (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
            ),
        },
    ]

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {cards.map((card, index) => (
                <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl p-4 border-slate-100 shadow-sm hover:shadow-md transition-all duration-300"
                >
                    <div className="flex items-start justify-between gap-2 mb-3">
                        <p className="text-xs text-slate-500 font-medium leading-tight">{card.label}</p>
                        <div className={`${card.iconBg} h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition transform duration-300`}>
                            {card.icon}
                        </div>
                    </div>
                    <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
                </motion.div>
            ))}
        </div>
    )
}

export default MembersStats
