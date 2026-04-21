'use client'

import { Button, Card, Label, ListBox, ListBoxItem, SearchField, Select } from '@heroui/react'
import { ReactNode } from 'react'

export type DataFilterOption<T extends string = string> = {
  value: T
  label: string
}

interface DataFilterBarProps {
  searchLabel: string
  searchValue: string
  onSearch: (value: string) => void
  filters: Array<{
    key: string
    ariaLabel: string
    value: string
    options: DataFilterOption[]
    onChange: (value: string) => void
  }>
  onClear: () => void
  clearDisabled?: boolean
  onPrimaryAction?: () => void
  primaryActionLabel?: string
  primaryActionDisabled?: boolean
  primaryActionLoading?: boolean
  summaryLeft?: ReactNode
  summaryRight?: ReactNode
}

function FilterSelect({
  ariaLabel,
  value,
  options,
  onChange,
}: {
  ariaLabel: string
  value: string
  options: DataFilterOption[]
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
      <Select.Trigger className="h-11 flex min-h-11 w-full items-center justify-between rounded-[18px] border border-gray-300 dark:border-white/18 bg-white dark:bg-white/12 px-4 text-left text-sm text-gray-900 dark:text-white outline-none transition-all duration-200 focus:border-sky-400 dark:focus:border-sky-400/60 focus:bg-white dark:focus:bg-white/18">
        <span className="truncate">{selectedLabel}</span>
        <Select.Indicator className="h-4 w-4 text-gray-400 dark:text-white/60" />
      </Select.Trigger>
      <Select.Popover className="min-w-[var(--trigger-width)] rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <ListBox className="p-1 text-slate-700 dark:text-white">
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

export default function DataFilterBar({
  searchLabel,
  searchValue,
  onSearch,
  filters,
  onClear,
  clearDisabled,
  onPrimaryAction,
  primaryActionLabel,
  primaryActionDisabled,
  primaryActionLoading,
  summaryLeft,
  summaryRight,
}: DataFilterBarProps) {
  return (
    <Card className="border border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-slate-900">
      <Card.Content className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full max-w-2xl">
            <SearchField
              aria-label={searchLabel}
              value={searchValue}
              onChange={onSearch}
              className="w-full"
            >
              <Label className="sr-only">{searchLabel}</Label>
              <SearchField.Group className="flex h-11 min-h-11 items-center gap-3 rounded-[18px] border border-gray-300 dark:border-white/18 bg-white dark:bg-white/12 px-4 transition-all duration-200 focus-within:border-sky-400 dark:focus-within:border-sky-400/60 focus-within:bg-white dark:focus-within:bg-white/18">
                <SearchField.SearchIcon className="h-4 w-4 text-gray-400 dark:text-white/60" />
                <SearchField.Input
                  className="flex-1 border-none bg-transparent p-0 text-sm text-gray-900 dark:text-white outline-none placeholder:text-gray-400 dark:placeholder:text-white/55"
                  placeholder="Search..."
                />
                {searchValue ? <SearchField.ClearButton className="text-gray-400 transition hover:text-gray-600 dark:text-white/60 dark:hover:text-white" /> : null}
              </SearchField.Group>
            </SearchField>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="secondary"
              onPress={onClear}
              isDisabled={clearDisabled}
              className="rounded-xl"
            >
              Clear
            </Button>
            {onPrimaryAction ? (
              <Button
                onPress={onPrimaryAction}
                isDisabled={primaryActionDisabled}
                className="rounded-xl bg-teal-600 text-white transition hover:bg-teal-700 disabled:bg-teal-300"
              >
                {primaryActionLoading ? 'Loading...' : (primaryActionLabel ?? 'Apply')}
              </Button>
            ) : null}
          </div>
        </div>

        {filters.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {filters.map((filter) => (
              <FilterSelect
                key={filter.key}
                ariaLabel={filter.ariaLabel}
                value={filter.value}
                options={filter.options}
                onChange={filter.onChange}
              />
            ))}
          </div>
        ) : null}

        {summaryLeft || summaryRight ? (
          <div className="flex flex-col gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
            <div>{summaryLeft}</div>
            <div>{summaryRight}</div>
          </div>
        ) : null}
      </Card.Content>
    </Card>
  )
}
