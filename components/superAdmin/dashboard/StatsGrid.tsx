'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useGetExpensesSummaryQuery } from '@/store/api/expensesApi'

interface StatCard {
  label: string
  value: string
  change: string
  changeType: 'up' | 'down' | 'neutral'
  icon: React.ReactNode
  iconBg: string
  iconText: string
  border: string
  valColor: string
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 2,
  }).format(value || 0)

const dateKey = (value: Date) => {
  const y = value.getFullYear()
  const m = String(value.getMonth() + 1).padStart(2, '0')
  const d = String(value.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const monthRange = (offsetMonths: number) => {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() + offsetMonths, 1)
  const end = new Date(now.getFullYear(), now.getMonth() + offsetMonths + 1, 0)
  return { from: dateKey(start), to: dateKey(end) }
}

const stats: StatCard[] = [
  {
    label: 'Total Orders',
    value: '₱ 0.00',
    change: '+0% this month',
    changeType: 'neutral',
    iconBg: 'bg-blue-50', iconText: 'text-blue-600', border: 'border-blue-100', valColor: 'text-blue-700',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  },
  {
    label: 'Total Rewards Computed',
    value: '₱ 30,058.00',
    change: '+12.4% vs last month',
    changeType: 'up',
    iconBg: 'bg-teal-50', iconText: 'text-teal-600', border: 'border-teal-100', valColor: 'text-teal-700',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    label: 'Withdrawals Released',
    value: '₱ 0.00',
    change: 'No withdrawals yet',
    changeType: 'neutral',
    iconBg: 'bg-emerald-50', iconText: 'text-emerald-600', border: 'border-emerald-100', valColor: 'text-emerald-700',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>,
  },
  {
    label: 'Withdrawals Pending',
    value: '₱ 4,620.00',
    change: '3 pending requests',
    changeType: 'down',
    iconBg: 'bg-red-50', iconText: 'text-red-500', border: 'border-red-100', valColor: 'text-red-700',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    label: 'Total Expenses',
    value: '₱ 1,000.00',
    change: '-5.2% vs last month',
    changeType: 'up',
    iconBg: 'bg-orange-50', iconText: 'text-orange-600', border: 'border-orange-100', valColor: 'text-orange-700',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  },
  {
    label: 'Total Members',
    value: '1',
    change: '+1 this week',
    changeType: 'up',
    iconBg: 'bg-purple-50', iconText: 'text-purple-600', border: 'border-purple-100', valColor: 'text-purple-700',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
  {
    label: 'Total Merchants',
    value: '0',
    change: 'No merchants yet',
    changeType: 'neutral',
    iconBg: 'bg-amber-50', iconText: 'text-amber-600', border: 'border-amber-100', valColor: 'text-amber-700',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 7l9-4 9 4-9 4-9-4zm0 10l9 4 9-4M3 12l9 4 9-4" /></svg>,
  },
  {
    label: 'Merchants Performance',
    value: '0%',
    change: 'No performance data yet',
    changeType: 'neutral',
    iconBg: 'bg-lime-50', iconText: 'text-lime-600', border: 'border-lime-100', valColor: 'text-lime-700',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  },
  {
    label: 'New Merchants',
    value: '0',
    change: '+0 this month',
    changeType: 'neutral',
    iconBg: 'bg-fuchsia-50', iconText: 'text-fuchsia-600', border: 'border-fuchsia-100', valColor: 'text-fuchsia-700',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" /></svg>,
  },
  {
    label: 'Merchant Payouts',
    value: '₱ 0.00',
    change: 'No payouts released',
    changeType: 'neutral',
    iconBg: 'bg-rose-50', iconText: 'text-rose-600', border: 'border-rose-100', valColor: 'text-rose-700',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 9V7a5 5 0 00-10 0v2m-2 0h14v11H5V9zm7 4v4" /></svg>,
  },
  {
    label: 'Total E-Wallet Float',
    value: '₱ 87,508.00',
    change: '+8.1% vs last month',
    changeType: 'up',
    iconBg: 'bg-indigo-50', iconText: 'text-indigo-600', border: 'border-indigo-100', valColor: 'text-indigo-700',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  },
  {
    label: 'Total GC Float',
    value: '₱ 15,308.00',
    change: '+3.7% vs last month',
    changeType: 'up',
    iconBg: 'bg-pink-50', iconText: 'text-pink-600', border: 'border-pink-100', valColor: 'text-pink-700',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>,
  },
  {
    label: "Today's Revenue",
    value: '₱ 0.00',
    change: 'No sales today',
    changeType: 'neutral',
    iconBg: 'bg-cyan-50', iconText: 'text-cyan-600', border: 'border-cyan-100', valColor: 'text-cyan-700',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  },
  {
    label: 'Monthly Revenue',
    value: '₱ 0.00',
    change: 'No sales this month',
    changeType: 'neutral',
    iconBg: 'bg-sky-50', iconText: 'text-sky-600', border: 'border-sky-100', valColor: 'text-sky-700',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  },
  {
    label: 'Active Sessions',
    value: '24',
    change: '+6 from yesterday',
    changeType: 'up',
    iconBg: 'bg-emerald-50', iconText: 'text-emerald-600', border: 'border-emerald-100', valColor: 'text-emerald-700',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-2" /></svg>,
  },
  {
    label: 'Growth Rate',
    value: '+24.5%',
    change: '+2.3% vs last month',
    changeType: 'up',
    iconBg: 'bg-violet-50', iconText: 'text-violet-600', border: 'border-violet-100', valColor: 'text-violet-700',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  },
]

const StatsGrid = () => {
  const currentMonth = useMemo(() => monthRange(0), [])
  const lastMonth = useMemo(() => monthRange(-1), [])

  const { data: currentExpenses } = useGetExpensesSummaryQuery({ from: currentMonth.from, to: currentMonth.to, status: 1 })
  const { data: lastExpenses } = useGetExpensesSummaryQuery({ from: lastMonth.from, to: lastMonth.to, status: 1 })

  const resolvedStats = useMemo(() => {
    const currentTotal = Number(currentExpenses?.total_amount ?? 0) || 0
    const lastTotal = Number(lastExpenses?.total_amount ?? 0) || 0

    let pct = 0
    if (lastTotal > 0) {
      pct = ((currentTotal - lastTotal) / lastTotal) * 100
    } else if (currentTotal > 0) {
      pct = 100
    }

    const isIncrease = currentTotal > lastTotal
    const isDecrease = currentTotal < lastTotal

    // For expenses, a decrease is "good" (green arrow).
    const changeType: StatCard['changeType'] = isIncrease ? 'down' : isDecrease ? 'up' : 'neutral'
    const change = `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}% vs last month`

    return stats.map((stat) =>
      stat.label === 'Total Expenses'
        ? {
            ...stat,
            value: formatMoney(currentTotal),
            change,
            changeType,
          }
        : stat,
    )
  }, [currentExpenses?.total_amount, lastExpenses?.total_amount])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {resolvedStats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          className={`bg-white rounded-2xl p-4 shadow-sm border ${stat.border} hover:shadow-md transition-all duration-300 group`}
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <p className="text-[11px] text-slate-400 font-medium leading-tight">{stat.label}</p>
            <div className={`${stat.iconBg} ${stat.iconText} h-9 w-9 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}>
              {stat.icon}
            </div>
          </div>
          <p className={`text-xl font-bold ${stat.valColor} mb-2`}>{stat.value}</p>
          <div className="flex items-center gap-1">
            {stat.changeType === 'up' && (
              <svg className="w-3 h-3 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            )}
            {stat.changeType === 'down' && (
              <svg className="w-3 h-3 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            )}
            <span className={`text-[11px] font-medium ${stat.changeType === 'up' ? 'text-emerald-600' : stat.changeType === 'down' ? 'text-red-500' : 'text-slate-400'}`}>
              {stat.change}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default StatsGrid
