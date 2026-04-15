'use client'

import { motion } from 'framer-motion'
import { MOCK_LOGS } from './types'

const today    = new Date().toDateString()
const todayLogs = MOCK_LOGS.filter(l => new Date(l.timestamp).toDateString() === today)

const STATS = [
  {
    label: 'Actions Today',
    value: String(todayLogs.length),
    bg: 'bg-teal-50', text: 'text-teal-600',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  },
  {
    label: 'Active Members Today',
    value: String(new Set(todayLogs.map(l => l.memberId)).size),
    bg: 'bg-blue-50', text: 'text-blue-600',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
  {
    label: 'Failed Actions',
    value: String(MOCK_LOGS.filter(l => l.status === 'failed').length),
    bg: 'bg-red-50', text: 'text-red-600',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  },
  {
    label: 'Pending Reviews',
    value: String(MOCK_LOGS.filter(l => l.status === 'pending').length),
    bg: 'bg-amber-50', text: 'text-amber-600',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
]

export default function ActivityLogsStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {STATS.map((s, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className={`h-10 w-10 rounded-xl ${s.bg} ${s.text} flex items-center justify-center shrink-0`}>
            {s.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-400 font-medium">{s.label}</p>
            <p className="text-xl font-bold text-slate-800">{s.value}</p>
          </div>
        </div>
      ))}
    </motion.div>
  )
}
