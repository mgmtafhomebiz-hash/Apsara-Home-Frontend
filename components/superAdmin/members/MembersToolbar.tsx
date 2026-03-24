'use client'

import { MemberStatus, MemberTier } from "@/types/members/types"

interface MembersToolbarProps {
  search: string
  onSearch: (v: string) => void
  status: 'all' | MemberStatus
  onStatus: (v: 'all' | MemberStatus) => void
  tier: 'all' | MemberTier
  onTier: (v: 'all' | MemberTier) => void
  sort: 'default' | 'earnings_low_high' | 'earnings_high_low' | 'referrals_high_low'
  onSort: (v: 'default' | 'earnings_low_high' | 'earnings_high_low' | 'referrals_high_low') => void
  resultCount: number
  onExport: () => void
  isExporting?: boolean
}

const MembersToolbar = ({
  search, onSearch, status, onStatus, tier, onTier, sort, onSort, resultCount, onExport, isExporting = false
}: MembersToolbarProps) => {
  const hasFilter = search !== '' || status !== 'all' || tier !== 'all' || sort !== 'default'

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">

        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search name or email..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
          />
          {search && (
            <button onClick={() => onSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>

        {/* Selects */}
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <select
            value={status}
            onChange={(e) => onStatus(e.target.value as 'all' | MemberStatus)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all min-w-[130px] cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="blocked">Blocked</option>
            <option value="kyc_review">KYC Review</option>
          </select>
          <select
            value={tier}
            onChange={(e) => onTier(e.target.value as 'all' | MemberTier)}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all min-w-[120px] cursor-pointer"
          >
            <option value="all">All Tiers</option>
            <option value="Home Starter">Home Starter</option>
            <option value="Home Builder">Home Builder</option>
            <option value="Home Stylist">Home Stylist</option>
            <option value="Lifestyle Consultant">Lifestyle Consultant</option>
            <option value="Lifestyle Elite">Lifestyle Elite</option>
          </select>
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value as 'default' | 'earnings_low_high' | 'earnings_high_low' | 'referrals_high_low')}
            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all min-w-[170px] cursor-pointer"
          >
            <option value="default">Default Sort</option>
            <option value="earnings_low_high">Earnings: Low to High</option>
            <option value="earnings_high_low">Earnings: High to Low</option>
            <option value="referrals_high_low">Highest Referrals</option>
          </select>
        </div>

        {/* Export */}
        <button
          type="button"
          onClick={onExport}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-medium transition-colors shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          <span>{isExporting ? 'Exporting...' : 'Export'}</span>
        </button>
      </div>

      {/* Result count + clear */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-50">
        <p className="text-xs text-slate-400">
          Showing{' '}
          <span className="font-semibold text-slate-600">{resultCount}</span>{' '}
          member{resultCount !== 1 ? 's' : ''}
          {hasFilter && <span className="text-teal-500 ml-1">· filtered</span>}
        </p>
        {hasFilter && (
          <button
            onClick={() => { onSearch(''); onStatus('all'); onTier('all'); onSort('default') }}
            className="text-xs text-teal-600 hover:text-teal-800 font-medium hover:underline transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}

export default MembersToolbar
