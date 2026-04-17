'use client'

import { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const todayData = [
  { time: '4 Jan', referral: 160, direct: 100, social: 80 },
  { time: '5 Jan', referral: 100, direct: 120, social: 160 },
  { time: '6 Jan', referral: 80,  direct: 40,  social: 130 },
  { time: '7 Jan', referral: 130, direct: 110, social: 90 },
  { time: '8 Jan', referral: 150, direct: 160, social: 110 },
  { time: '9 Jan', referral: 90,  direct: 80,  social: 170 },
  { time: '10 Jan', referral: 70, direct: 60,  social: 130 },
]

const monthlyData = [
  { time: 'Jan', referral: 4000, direct: 2400, social: 2400 },
  { time: 'Feb', referral: 3000, direct: 1398, social: 2210 },
  { time: 'Mar', referral: 2000, direct: 9800, social: 2290 },
  { time: 'Apr', referral: 2780, direct: 3908, social: 2000 },
  { time: 'May', referral: 1890, direct: 4800, social: 2181 },
  { time: 'Jun', referral: 2390, direct: 3800, social: 2500 },
  { time: 'Jul', referral: 3490, direct: 4300, social: 2100 },
]

const yearlyData = [
  { time: '2021', referral: 24000, direct: 18000, social: 14000 },
  { time: '2022', referral: 32000, direct: 22000, social: 19000 },
  { time: '2023', referral: 28000, direct: 26000, social: 21000 },
  { time: '2024', referral: 41000, direct: 30000, social: 28000 },
  { time: '2025', referral: 38000, direct: 35000, social: 32000 },
  { time: '2026', referral: 45000, direct: 38000, social: 34000 },
]

const tabs = ["Today's", 'Monthly', 'Yearly']

const SalesChart = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const data = [todayData, monthlyData, yearlyData][activeTab]

  if (!mounted) return <div className="h-85 animate-pulse rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800" />

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Sales Order Report</h3>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">Track your revenue performance</p>
        </div>
        <div className="flex gap-1 self-start rounded-xl bg-gray-100 p-1 dark:bg-gray-800/80 sm:self-auto">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                activeTab === index
                  ? 'bg-white text-teal-600 dark:bg-gray-700 dark:text-teal-300'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorReferral" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDirect" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSocial" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,114,128,0.18)" />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: '1px solid rgba(51,65,85,0.7)', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.10)', backgroundColor: 'rgba(15,23,42,0.95)', color: '#e2e8f0' }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '16px', color: '#6b7280' }} />
          <Area type="monotone" dataKey="referral" name="Via Referral" stroke="#14b8a6" fill="url(#colorReferral)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
          <Area type="monotone" dataKey="direct" name="Direct" stroke="#f97316" fill="url(#colorDirect)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
          <Area type="monotone" dataKey="social" name="Via Social" stroke="#8b5cf6" fill="url(#colorSocial)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SalesChart
