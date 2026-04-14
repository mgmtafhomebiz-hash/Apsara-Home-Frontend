'use client'

import { Button, Card, Label, ListBox, ListBoxItem, SearchField, Select } from '@heroui/react'
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

const statusOptions: Array<{ value: 'all' | MemberStatus; label: string }> = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'kyc_review', label: 'KYC Review' },
]

const tierOptions: Array<{ value: 'all' | MemberTier; label: string }> = [
  { value: 'all', label: 'All Tiers' },
  { value: 'Home Starter', label: 'Home Starter' },
  { value: 'Home Builder', label: 'Home Builder' },
  { value: 'Home Stylist', label: 'Home Stylist' },
  { value: 'Lifestyle Consultant', label: 'Lifestyle Consultant' },
  { value: 'Lifestyle Elite', label: 'Lifestyle Elite' },
]

const registrationOptions: Array<{ value: 'all' | 'new' | 'referred' | 'direct'; label: string }> = [
  { value: 'all', label: 'All Members' },
  { value: 'new', label: 'New Members' },
  { value: 'referred', label: 'Referred Members' },
  { value: 'direct', label: 'Direct Signups' },
]

const profilePhotoOptions: Array<{ value: 'all' | 'with_photo' | 'no_photo'; label: string }> = [
  { value: 'all', label: 'All Avatars' },
  { value: 'with_photo', label: 'With Avatar URL' },
  { value: 'no_photo', label: 'No Avatar URL' },
]

const sortOptions: Array<{
  value: 'default' | 'newest_registered' | 'oldest_registered' | 'earnings_low_high' | 'earnings_high_low' | 'referrals_high_low'
  label: string
}> = [
  { value: 'default', label: 'Default Sort' },
  { value: 'newest_registered', label: 'Newest Registered' },
  { value: 'oldest_registered', label: 'Oldest Registered' },
  { value: 'earnings_low_high', label: 'Earnings: Low to High' },
  { value: 'earnings_high_low', label: 'Earnings: High to Low' },
  { value: 'referrals_high_low', label: 'Highest Referrals' },
]

function ToolbarSelect({
  ariaLabel,
  value,
  options,
  onChange,
}: {
  ariaLabel: string
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}) {
  const selectedLabel = options.find((option) => option.value === value)?.label ?? options[0]?.label ?? 'Select'

  return (
    <Select
      aria-label={ariaLabel}
      selectedKey={value}
      onSelectionChange={(key) => {
        if (key != null) onChange(String(key))
      }}
      className="w-full"
    >
      <Select.Trigger className="flex min-h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 text-left text-sm text-slate-700 transition-all duration-200 hover:bg-white focus:border-teal-300 focus:bg-white">
        <span className="truncate">{selectedLabel}</span>
        <Select.Indicator className="h-4 w-4 text-slate-400" />
      </Select.Trigger>
      <Select.Popover className="min-w-[var(--trigger-width)]">
        <ListBox className="p-1">
          {options.map((option) => (
            <ListBoxItem id={option.value} key={option.value}>
              {option.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  )
}

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
    <Card className="border border-slate-200 bg-white shadow-none">
      <Card.Content className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full max-w-2xl">
            <SearchField
              aria-label="Search members"
              value={search}
              onChange={onSearch}
              className="w-full"
            >
              <Label className="sr-only">Search members</Label>
              <SearchField.Group className="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition-all duration-200 focus-within:border-teal-300 focus-within:bg-white">
                <SearchField.SearchIcon className="h-4 w-4 text-slate-400" />
                <SearchField.Input
                  placeholder="Search name or email..."
                  className="flex-1 border-none bg-transparent p-0 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
                {search ? <SearchField.ClearButton className="text-slate-400 transition hover:text-slate-600" /> : null}
              </SearchField.Group>
            </SearchField>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="secondary"
              onPress={() => {
                onSearch('')
                onStatus('all')
                onTier('all')
                onRegistration('all')
                onProfilePhoto('all')
                onSort('default')
              }}
              isDisabled={!hasFilter}
              className="rounded-xl"
            >
              Clear
            </Button>
            <Button
              onPress={onExport}
              isDisabled={isExporting}
              className="rounded-xl bg-teal-600 text-white transition hover:bg-teal-700 disabled:bg-teal-300"
            >
              {isExporting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                  <span>Export CSV</span>
                </span>
              ) : 'Export CSV'}
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <ToolbarSelect
            ariaLabel="Filter members by status"
            value={status}
            options={statusOptions}
            onChange={(value) => onStatus(value as 'all' | MemberStatus)}
          />
          <ToolbarSelect
            ariaLabel="Filter members by tier"
            value={tier}
            options={tierOptions}
            onChange={(value) => onTier(value as 'all' | MemberTier)}
          />
          <ToolbarSelect
            ariaLabel="Filter members by registration source"
            value={registration}
            options={registrationOptions}
            onChange={(value) => onRegistration(value as 'all' | 'new' | 'referred' | 'direct')}
          />
          <ToolbarSelect
            ariaLabel="Filter members by profile photo"
            value={profilePhoto}
            options={profilePhotoOptions}
            onChange={(value) => onProfilePhoto(value as 'all' | 'with_photo' | 'no_photo')}
          />
          <ToolbarSelect
            ariaLabel="Sort members"
            value={sort}
            options={sortOptions}
            onChange={(value) => onSort(value as 'default' | 'newest_registered' | 'oldest_registered' | 'earnings_low_high' | 'earnings_high_low' | 'referrals_high_low')}
          />
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-semibold text-slate-700">{resultCount.toLocaleString()}</span> member{resultCount !== 1 ? 's' : ''}
            {hasFilter ? <span className="ml-1 text-teal-600">filtered</span> : null}
          </p>
          <p className="text-slate-400">Filters and export now follow the same Hero UI controls used in products.</p>
        </div>
      </Card.Content>
    </Card>
  )
}

export default MembersToolbar
