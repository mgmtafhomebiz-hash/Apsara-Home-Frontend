'use client'

import { motion } from 'framer-motion'
import { ActivityLog, ACTION_CONFIG, STATUS_CONFIG, formatTimestamp, timeAgo } from './types'

const getInitials = (name: string) =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

interface ActivityLogsTableProps {
  logs: ActivityLog[]
}

export default function ActivityLogsTable({ logs }: ActivityLogsTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
              <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Member</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Action</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Detail</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">IP / Device</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70 dark:divide-slate-800/70">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-14 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-sm font-semibold text-slate-500">No activity logs found</p>
                    <p className="text-xs text-slate-400">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map(log => {
                const action = ACTION_CONFIG[log.action]
                const status = STATUS_CONFIG[log.status]
                return (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Member */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {getInitials(log.memberName)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{log.memberName}</p>
                          <p className="text-xs text-slate-400">{log.memberEmail}</p>
                        </div>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${action.bg} ${action.text}`}>
                        <span>{action.icon}</span>
                        {action.label}
                      </span>
                    </td>

                    {/* Detail */}
                    <td className="px-4 py-3.5 max-w-[220px]">
                      <p className="text-xs text-slate-600 truncate" title={log.detail}>{log.detail}</p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${status.bg} ${status.text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </td>

                    {/* IP / Device */}
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-medium text-slate-600">{log.ipAddress}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{log.device}</p>
                    </td>

                    {/* Time */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <p className="text-xs font-medium text-slate-600">{timeAgo(log.timestamp)}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{formatTimestamp(log.timestamp)}</p>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 border-t border-slate-100 text-xs text-slate-400">
        {logs.length} {logs.length === 1 ? 'entry' : 'entries'} shown · Latest first
      </div>
    </motion.div>
  )
}

