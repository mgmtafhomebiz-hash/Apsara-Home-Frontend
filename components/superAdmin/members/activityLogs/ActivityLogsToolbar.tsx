'use client'

import { motion } from 'framer-motion'
import { ActivityStatus, ACTION_FILTER_OPTIONS } from './types'

interface ActivityLogsToolbarProps {
  search: string
  onSearch: (v: string) => void
  actionFilter: string
  onActionFilter: (v: string) => void
  total: number
  isLoading?: boolean
}

export default function ActivityLogsToolbar({
  search, onSearch,
  actionFilter, onActionFilter,
  total,
  isLoading,
}: ActivityLogsToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
    >
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search member, email or action detail..."
            value={search}
            onChange={e => onSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 dark:focus:ring-sky-400/40 dark:focus:border-sky-400 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition"
          />
          {search && (
            <button onClick={() => onSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        {/* Action filter */}
        <select
          value={actionFilter}
          onChange={e => onActionFilter(e.target.value)}
          disabled={isLoading}
          className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-500 dark:focus:ring-sky-400/40 dark:focus:border-sky-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="all">All Activities</option>
          <option value="login">Login</option>
          <option value="logout">Logout</option>
          <option value="purchase">Purchase</option>
          <option value="profile_update">Profile Update</option>
          <option value="wallet_transaction">Wallet Transaction</option>
          <option value="encashment_request">Encashment</option>
          <option value="verification_request">Verification</option>
          <option value="password_change">Password Change</option>
          <option value="account_status_change">Account Status</option>
        </select>

        {/* Export */}
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-100 rounded-lg text-sm font-semibold transition-colors ml-auto">
          <svg className="w-4 h-4 text-sky-500 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Showing <span className="font-semibold text-gray-600 dark:text-gray-300">{total}</span> activity logs
      </p>
    </motion.div>
  )
}
