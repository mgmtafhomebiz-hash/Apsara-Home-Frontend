'use client'

import DataFilterBar, { type DataFilterOption } from '@/components/superAdmin/DataFilterBar'
import { MemberStatus, MemberTier } from '@/types/members/types'

interface MembersToolbarProps {
  search: string
  onSearch: (v: string) => void
  status: 'all' | MemberStatus
  onStatus: (v: 'all' | MemberStatus) => void
  tier: 'all' | MemberTier
  onTier: (v: 'all' | MemberTier) => void
  registration: 'all' | 'new' | 'referred' | 'direct'
  onRegistration: (v: 'all' | 'new' | 'referred' | 'direct') => void
  profilePhoto: 'all' | 'with_photo' | 'no_photo'
  onProfilePhoto: (v: 'all' | 'with_photo' | 'no_photo') => void
  sort: 'default' | 'newest_registered' | 'oldest_registered' | 'earnings_low_high' | 'earnings_high_low' | 'referrals_high_low'
  onSort: (v: 'default' | 'newest_registered' | 'oldest_registered' | 'earnings_low_high' | 'earnings_high_low' | 'referrals_high_low') => void
  resultCount: number
  onExport: () => void
  isExporting?: boolean
}

const statusOptions: DataFilterOption<'all' | MemberStatus>[] = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'kyc_review', label: 'KYC Review' },
]

const tierOptions: DataFilterOption<'all' | MemberTier>[] = [
  { value: 'all', label: 'All Tiers' },
  { value: 'Home Starter', label: 'Home Starter' },
  { value: 'Home Builder', label: 'Home Builder' },
  { value: 'Home Stylist', label: 'Home Stylist' },
  { value: 'Lifestyle Consultant', label: 'Lifestyle Consultant' },
  { value: 'Lifestyle Elite', label: 'Lifestyle Elite' },
]

const registrationOptions: DataFilterOption<'all' | 'new' | 'referred' | 'direct'>[] = [
  { value: 'all', label: 'All Members' },
  { value: 'new', label: 'New Members' },
  { value: 'referred', label: 'Referred Members' },
  { value: 'direct', label: 'Direct Signups' },
]

const profilePhotoOptions: DataFilterOption<'all' | 'with_photo' | 'no_photo'>[] = [
  { value: 'all', label: 'All Avatars' },
  { value: 'with_photo', label: 'With Avatar URL' },
  { value: 'no_photo', label: 'No Avatar URL' },
]

const sortOptions: DataFilterOption<'default' | 'newest_registered' | 'oldest_registered' | 'earnings_low_high' | 'earnings_high_low' | 'referrals_high_low'>[] = [
  { value: 'default', label: 'Default Sort' },
  { value: 'newest_registered', label: 'Newest Registered' },
  { value: 'oldest_registered', label: 'Oldest Registered' },
  { value: 'earnings_low_high', label: 'Earnings: Low to High' },
  { value: 'earnings_high_low', label: 'Earnings: High to Low' },
  { value: 'referrals_high_low', label: 'Highest Referrals' },
]

const MembersToolbar = ({
  search,
  onSearch,
  status,
  onStatus,
  tier,
  onTier,
  registration,
  onRegistration,
  profilePhoto,
  onProfilePhoto,
  sort,
  onSort,
  resultCount,
  onExport,
  isExporting = false,
}: MembersToolbarProps) => {
  const hasFilter = search !== '' || status !== 'all' || tier !== 'all' || registration !== 'all' || profilePhoto !== 'all' || sort !== 'default'

  return (
    <DataFilterBar
      searchLabel="Search members"
      searchValue={search}
      onSearch={onSearch}
      filters={[
        {
          key: 'status',
          ariaLabel: 'Filter members by status',
          value: status,
          options: statusOptions,
          onChange: (value) => onStatus(value as 'all' | MemberStatus),
        },
        {
          key: 'tier',
          ariaLabel: 'Filter members by tier',
          value: tier,
          options: tierOptions,
          onChange: (value) => onTier(value as 'all' | MemberTier),
        },
        {
          key: 'registration',
          ariaLabel: 'Filter members by registration source',
          value: registration,
          options: registrationOptions,
          onChange: (value) => onRegistration(value as 'all' | 'new' | 'referred' | 'direct'),
        },
        {
          key: 'profilePhoto',
          ariaLabel: 'Filter members by profile photo',
          value: profilePhoto,
          options: profilePhotoOptions,
          onChange: (value) => onProfilePhoto(value as 'all' | 'with_photo' | 'no_photo'),
        },
        {
          key: 'sort',
          ariaLabel: 'Sort members',
          value: sort,
          options: sortOptions,
          onChange: (value) => onSort(value as 'default' | 'newest_registered' | 'oldest_registered' | 'earnings_low_high' | 'earnings_high_low' | 'referrals_high_low'),
        },
      ]}
      onClear={() => {
        onSearch('')
        onStatus('all')
        onTier('all')
        onRegistration('all')
        onProfilePhoto('all')
        onSort('default')
      }}
      clearDisabled={!hasFilter}
      onPrimaryAction={onExport}
      primaryActionLabel="Export CSV"
      primaryActionDisabled={isExporting}
      primaryActionLoading={isExporting}
      summaryLeft={(
        <p>
          <span className="font-semibold text-slate-700 dark:text-white">{resultCount.toLocaleString()}</span> member{resultCount !== 1 ? 's' : ''}
          {hasFilter ? <span className="ml-1 text-teal-600">filtered</span> : null}
        </p>
      )}
      summaryRight={(
        <p className="text-slate-400 dark:text-slate-300">Filters and export now follow the same Hero UI controls used in products.</p>
      )}
    />
  )
}

export default MembersToolbar
