'use client'

import DataFilterBar from '@/components/superAdmin/DataFilterBar'
import { MemberWallet, SortKey } from './types'

const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
  { key: 'cashBalance', label: 'Cash Balance' },
  { key: 'pvBalance', label: 'PV Balance' },
  { key: 'lockedAmount', label: 'Locked' },
  { key: 'availableAmount', label: 'Available' },
]

const TIER_OPTIONS = [
  'All Tiers',
  'Home Starter',
  'Home Builder',
  'Home Stylist',
  'Lifestyle Consultant',
  'Lifestyle Elite',
] as const

const STATUS_OPTIONS = [
  'All Status',
  'Active',
  'Pending',
  'Blocked',
] as const

type TierFilterValue = (typeof TIER_OPTIONS)[number] | MemberWallet['tier']
type StatusFilterValue = (typeof STATUS_OPTIONS)[number]

interface WalletCreditsToolbarProps {
  search: string
  onSearch: (v: string) => void
  tierFilter: TierFilterValue
  onTierFilter: (v: TierFilterValue) => void
  statusFilter: StatusFilterValue
  onStatusFilter: (v: StatusFilterValue) => void
  sortKey: SortKey
  onSortKey: (v: SortKey) => void
}

export default function WalletCreditsToolbar({
  search,
  onSearch,
  tierFilter,
  onTierFilter,
  statusFilter,
  onStatusFilter,
  sortKey,
  onSortKey,
}: WalletCreditsToolbarProps) {
  return (
    <DataFilterBar
      searchLabel="Search member"
      searchValue={search}
      onSearch={onSearch}
      filters={[
        {
          key: 'tier',
          ariaLabel: 'Tier',
          value: tierFilter,
          onChange: (value) => onTierFilter(value as TierFilterValue),
          options: TIER_OPTIONS.map((label) => ({ label, value: label })),
        },
        {
          key: 'status',
          ariaLabel: 'Status',
          value: statusFilter,
          onChange: (value) => onStatusFilter(value as StatusFilterValue),
          options: STATUS_OPTIONS.map((label) => ({ label, value: label })),
        },
      ]}
      onClear={() => {
        onSearch('')
        onTierFilter('All Tiers')
        onStatusFilter('All Status')
      }}
      clearDisabled={!search && tierFilter === 'All Tiers' && statusFilter === 'All Status'}
      summaryLeft={(
        <div className="flex items-center gap-1 rounded-[18px] border border-gray-300 bg-white p-1 dark:border-white/18 dark:bg-white/12">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => onSortKey(option.key)}
              className={`rounded-[14px] px-3 py-1.5 text-xs font-semibold transition-all ${
                sortKey === option.key
                  ? 'border border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-400/30 dark:bg-sky-500/10 dark:text-sky-300'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    />
  )
}
