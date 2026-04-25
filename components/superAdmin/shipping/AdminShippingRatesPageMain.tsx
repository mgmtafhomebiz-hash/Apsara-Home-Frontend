'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import {
  useBulkDeleteAdminShippingRatesMutation,
  useCreateAdminShippingRateMutation,
  useDeleteAdminShippingRateMutation,
  useGetAdminShippingRatesQuery,
  useUpdateAdminShippingRateMutation,
  type ShippingRate,
} from '@/store/api/shippingRatesApi'
import { showErrorToast, showSuccessToast } from '@/libs/toast'

const emptyForm = {
  province: '',
  city: '',
  fee: '',
  status: true,
}

type ShippingRateForm = typeof emptyForm

type AddressOption = {
  code: string
  name: string
  source: 'province' | 'region'
}

const PSGC_BASE_URL = 'https://psgc.gitlab.io/api'
const CURRENT_PROVINCE_FALLBACK_CODE = '__current_province__'
const CURRENT_CITY_FALLBACK_CODE = '__current_city__'
const provinceOptionsCache: AddressOption[] = []
const cityOptionsCache = new Map<string, Array<{ code: string; name: string }>>()
let provinceOptionsRequest: Promise<AddressOption[]> | null = null

const SPECIAL_REGION_OPTIONS: AddressOption[] = [
  { code: '130000000', name: 'Metro Manila (NCR)', source: 'region' },
  { code: '140000000', name: 'CAR', source: 'region' },
]

const normalizeLocationKey = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/\bcity of\b/g, '')
    .replace(/\b(city|municipality|province|region)\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')

const fetchPsgcItems = async (path: string) => {
  const response = await fetch(`${PSGC_BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error('Failed to load address data.')
  }

  const payload = await response.json() as Array<{ code?: string; name?: string }>
  return (payload ?? [])
    .map((item) => ({
      code: String(item.code ?? ''),
      name: String(item.name ?? ''),
    }))
    .filter((item) => item.code && item.name)
    .sort((a, b) => a.name.localeCompare(b.name))
}

const loadProvinceOptions = async () => {
  if (provinceOptionsCache.length) {
    return provinceOptionsCache
  }

  if (!provinceOptionsRequest) {
    provinceOptionsRequest = fetchPsgcItems('/provinces/')
      .then((items) => [
        ...SPECIAL_REGION_OPTIONS,
        ...items.map((item) => ({ ...item, source: 'province' as const })),
      ])
      .catch(() => [...SPECIAL_REGION_OPTIONS])
      .then((items) => {
        provinceOptionsCache.splice(0, provinceOptionsCache.length, ...items)
        return provinceOptionsCache
      })
      .finally(() => {
        provinceOptionsRequest = null
      })
  }

  return provinceOptionsRequest
}

const loadCityOptions = async (province: AddressOption) => {
  const cacheKey = `${province.source}:${province.code}`
  const cached = cityOptionsCache.get(cacheKey)
  if (cached) {
    return cached
  }

  const path = province.source === 'region'
    ? `/regions/${province.code}/cities-municipalities/`
    : `/provinces/${province.code}/cities-municipalities/`

  const items = await fetchPsgcItems(path).catch(() => [])
  cityOptionsCache.set(cacheKey, items)
  return items
}

const formatPeso = (value: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value || 0)

const getApiErrorMessage = (error: unknown, fallback: string) => {
  const apiError = error as { data?: { message?: string; errors?: Record<string, string[]> } }
  return apiError?.data?.message ?? Object.values(apiError?.data?.errors ?? {})[0]?.[0] ?? fallback
}

function ShippingRateFormFields({
  form,
  onFieldChange,
  disabled = false,
}: {
  form: ShippingRateForm
  onFieldChange: (key: keyof ShippingRateForm, value: string | boolean) => void
  disabled?: boolean
}) {
  const [provinceOptions, setProvinceOptions] = useState<AddressOption[]>([])
  const [cityOptions, setCityOptions] = useState<Array<{ code: string; name: string }>>([])
  const [loadingProvinces, setLoadingProvinces] = useState(true)
  const [loadingCities, setLoadingCities] = useState(false)
  const normalizedProvince = normalizeLocationKey(form.province)
  const normalizedCity = normalizeLocationKey(form.city)
  const selectedProvince = provinceOptions.find((option) => normalizeLocationKey(option.name) === normalizedProvince) ?? null
  const selectedProvinceCode = selectedProvince?.code ?? ''
  const matchedCityCode = cityOptions.find((option) => normalizeLocationKey(option.name) === normalizedCity)?.code ?? ''
  const showCurrentProvinceFallback = Boolean(
    form.province &&
    !loadingProvinces &&
    !selectedProvinceCode &&
    !provinceOptions.some((option) => normalizeLocationKey(option.name) === normalizedProvince)
  )
  const showCurrentCityFallback = Boolean(
    form.city &&
    selectedProvinceCode &&
    !loadingCities &&
    !matchedCityCode &&
    !cityOptions.some((option) => normalizeLocationKey(option.name) === normalizedCity)
  )
  const selectedProvinceValue = showCurrentProvinceFallback ? CURRENT_PROVINCE_FALLBACK_CODE : selectedProvinceCode
  const selectedCityValue = showCurrentCityFallback ? CURRENT_CITY_FALLBACK_CODE : matchedCityCode

  useEffect(() => {
    let active = true
    void Promise.resolve().then(() => {
      if (active) setLoadingProvinces(true)
    })

    loadProvinceOptions()
      .then((items) => {
        if (!active) return
        setProvinceOptions(items)
      })
      .finally(() => {
        if (active) setLoadingProvinces(false)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!selectedProvinceCode) {
      void Promise.resolve().then(() => {
        setCityOptions([])
        setLoadingCities(false)
      })
      return
    }

    if (!selectedProvince) {
      void Promise.resolve().then(() => {
        setCityOptions([])
        setLoadingCities(false)
      })
      return
    }

    let active = true
    void Promise.resolve().then(() => {
      if (active) setLoadingCities(true)
    })
    loadCityOptions(selectedProvince)
      .then((items) => {
        if (!active) return
        setCityOptions(items)
      })
      .finally(() => {
        if (active) setLoadingCities(false)
      })

    return () => {
      active = false
    }
  }, [selectedProvince, selectedProvinceCode])

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Province
          </label>
          {loadingProvinces ? (
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-500">
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-sky-200 border-t-sky-500 dark:border-sky-900 dark:border-t-sky-400" />
              Loading
            </span>
          ) : null}
        </div>
        <div className="relative">
          <select
            value={selectedProvinceValue}
            onChange={(event) => {
              const nextCode = event.target.value
              if (nextCode === CURRENT_PROVINCE_FALLBACK_CODE) {
                return
              }
              const matchedProvince = provinceOptions.find((option) => option.code === nextCode)
              onFieldChange('province', matchedProvince?.name ?? '')
              onFieldChange('city', '')
            }}
            disabled={disabled || loadingProvinces}
            className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-11 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-sky-900/30"
          >
            <option value="">{loadingProvinces ? 'Loading provinces...' : 'Select Province'}</option>
            {showCurrentProvinceFallback ? <option value={CURRENT_PROVINCE_FALLBACK_CODE}>{form.province}</option> : null}
            {provinceOptions.map((option) => (
              <option key={`${option.source}-${option.code}`} value={option.code}>
                {option.name}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" />
            </svg>
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Uses PSGC province options, similar to checkout.
        </p>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            City / Municipality
          </label>
          {loadingCities ? (
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-500">
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-sky-200 border-t-sky-500 dark:border-sky-900 dark:border-t-sky-400" />
              Loading
            </span>
          ) : null}
        </div>
        <div className="relative">
          <select
            value={selectedCityValue}
            onChange={(event) => {
              const nextCode = event.target.value
              if (nextCode === CURRENT_CITY_FALLBACK_CODE) {
                return
              }
              const matchedCity = cityOptions.find((option) => option.code === nextCode)
              onFieldChange('city', matchedCity?.name ?? '')
            }}
            disabled={disabled || loadingProvinces || loadingCities || !selectedProvinceCode}
            className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-11 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-sky-900/30"
          >
            <option value="">
              {!selectedProvinceCode
                ? 'Select Province First'
                : loadingCities
                  ? 'Loading cities...'
                  : 'Select City / Municipality'}
            </option>
            {showCurrentCityFallback ? <option value={CURRENT_CITY_FALLBACK_CODE}>{form.city}</option> : null}
            {cityOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.name}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" />
            </svg>
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Municipality options load after you choose a province.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          Shipping Fee
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
            PHP
          </span>
          <input
            value={form.fee}
            onChange={(event) => onFieldChange('fee', event.target.value)}
            type="number"
            min="0"
            disabled={disabled}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-14 pr-4 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-sky-900/30"
            placeholder="0"
          />
        </div>
      </div>

      <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/80">
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Active in checkout</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Only active rates are used for manual checkout.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={form.status}
          disabled={disabled}
          onClick={() => onFieldChange('status', !form.status)}
          className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-60 ${
            form.status
              ? 'border-sky-400 bg-sky-500'
              : 'border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-700'
          }`}
        >
          <span
            className={`inline-block h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
              form.status ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </label>
    </div>
  )
}

function ButtonSpinner({ tone = 'light' }: { tone?: 'light' | 'danger' }) {
  const borderClass = tone === 'danger' ? 'border-white/30 border-t-white' : 'border-white/30 border-t-white'
  return <span className={`inline-block h-4 w-4 animate-spin rounded-full border-2 ${borderClass}`} />
}

function ShippingRateModal({
  open,
  title,
  description,
  children,
  footer,
  onClose,
}: {
  open: boolean
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
  onClose: () => void
}) {
  if (!open) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-8">
        <motion.button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.97 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-[71] w-full max-w-xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-500">Shipping Rate</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-6 py-6">{children}</div>
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/60">
            {footer}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default function AdminShippingRatesPageMain() {
  const { data, isLoading, isFetching } = useGetAdminShippingRatesQuery()
  const [bulkDeleteRates, { isLoading: isBulkDeleting }] = useBulkDeleteAdminShippingRatesMutation()
  const [createRate, { isLoading: isCreating }] = useCreateAdminShippingRateMutation()
  const [updateRate, { isLoading: isUpdating }] = useUpdateAdminShippingRateMutation()
  const [deleteRate, { isLoading: isDeleting }] = useDeleteAdminShippingRateMutation()

  const [createForm, setCreateForm] = useState<ShippingRateForm>(emptyForm)
  const [editForm, setEditForm] = useState<ShippingRateForm>(emptyForm)
  const [editingRate, setEditingRate] = useState<ShippingRate | null>(null)
  const [deletingRate, setDeletingRate] = useState<ShippingRate | null>(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)
  const [selectedRateIds, setSelectedRateIds] = useState<number[]>([])

  const rates = useMemo(() => data?.rates ?? [], [data?.rates])
  const activeRatesCount = useMemo(() => rates.filter((rate) => rate.status).length, [rates])
  const inactiveRatesCount = rates.length - activeRatesCount

  const filteredRates = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return rates

    return rates.filter((rate) => {
      const haystack = `${rate.province} ${rate.city}`.toLowerCase()
      return haystack.includes(keyword)
    })
  }, [rates, searchTerm])

  const groupedRates = useMemo(() => {
    return Array.from(
      filteredRates.reduce((map, rate) => {
        if (!map.has(rate.province)) {
          map.set(rate.province, [])
        }
        map.get(rate.province)?.push(rate)
        return map
      }, new Map<string, ShippingRate[]>())
    )
  }, [filteredRates])

  const filteredRateIds = useMemo(() => filteredRates.map((rate) => rate.id), [filteredRates])
  const selectedVisibleCount = useMemo(
    () => filteredRateIds.filter((id) => selectedRateIds.includes(id)).length,
    [filteredRateIds, selectedRateIds]
  )
  const allVisibleSelected = filteredRateIds.length > 0 && selectedVisibleCount === filteredRateIds.length

  const updateCreateField = (key: keyof ShippingRateForm, value: string | boolean) => {
    setCreateForm((current) => ({ ...current, [key]: value }))
  }

  const updateEditField = (key: keyof ShippingRateForm, value: string | boolean) => {
    setEditForm((current) => ({ ...current, [key]: value }))
  }

  const resetCreateForm = () => {
    setCreateForm(emptyForm)
  }

  const toggleRateSelected = (id: number) => {
    setSelectedRateIds((current) => (
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    ))
  }

  const toggleSelectAllVisible = () => {
    setSelectedRateIds((current) => {
      if (allVisibleSelected) {
        const visibleSet = new Set(filteredRateIds)
        return current.filter((id) => !visibleSet.has(id))
      }

      const next = new Set(current)
      filteredRateIds.forEach((id) => next.add(id))
      return Array.from(next)
    })
  }

  const clearSelection = () => {
    setSelectedRateIds([])
  }

  const openEditModal = (rate: ShippingRate) => {
    setEditingRate(rate)
    setEditForm({
      province: rate.province,
      city: rate.city,
      fee: String(rate.fee),
      status: rate.status,
    })
  }

  const closeEditModal = () => {
    setEditingRate(null)
    setEditForm(emptyForm)
  }

  const validateForm = (form: ShippingRateForm) => {
    const fee = Number(form.fee)
    if (!form.province.trim() || !form.city.trim() || !Number.isFinite(fee) || fee < 0) {
      showErrorToast('Complete province, city, and valid shipping fee.')
      return null
    }

    return {
      province: form.province.trim(),
      city: form.city.trim(),
      fee,
      status: form.status,
    }
  }

  const handleCreate = async () => {
    const payload = validateForm(createForm)
    if (!payload) return

    try {
      await createRate(payload).unwrap()
      showSuccessToast('Shipping rate saved.')
      resetCreateForm()
    } catch (error) {
      showErrorToast(getApiErrorMessage(error, 'Failed to save shipping rate.'))
    }
  }

  const handleEditSave = async () => {
    if (!editingRate) return

    const payload = validateForm(editForm)
    if (!payload) return

    try {
      await updateRate({ id: editingRate.id, ...payload }).unwrap()
      showSuccessToast('Shipping rate updated.')
      closeEditModal()
    } catch (error) {
      showErrorToast(getApiErrorMessage(error, 'Failed to update shipping rate.'))
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingRate) return

    try {
      setPendingDeleteId(deletingRate.id)
      await deleteRate(deletingRate.id).unwrap()
      showSuccessToast('Shipping rate deleted.')
      setDeletingRate(null)
      setSelectedRateIds((current) => current.filter((id) => id !== deletingRate.id))
      if (editingRate?.id === deletingRate.id) {
        closeEditModal()
      }
    } catch (error) {
      showErrorToast(getApiErrorMessage(error, 'Failed to delete shipping rate.'))
    } finally {
      setPendingDeleteId(null)
    }
  }

  const handleBulkDeleteConfirm = async () => {
    if (selectedRateIds.length === 0) return

    try {
      await bulkDeleteRates(selectedRateIds).unwrap()
      showSuccessToast(`${selectedRateIds.length} shipping rate${selectedRateIds.length === 1 ? '' : 's'} deleted.`)
      clearSelection()
      setBulkDeleteOpen(false)
    } catch (error) {
      showErrorToast(getApiErrorMessage(error, 'Failed to delete selected shipping rates.'))
    }
  }

  const saving = isCreating || isUpdating

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-6"
      >
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_32%),linear-gradient(135deg,_#ffffff,_#f8fbff_58%,_#eef6ff)] p-6 shadow-sm dark:border-slate-700 dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_28%),linear-gradient(135deg,_#0f172a,_#111827_58%,_#0b1220)]"
        >
          <div className="pointer-events-none absolute -right-20 top-0 h-44 w-44 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/20" />
          <div className="pointer-events-none absolute bottom-0 left-24 h-36 w-36 rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-500/20" />
          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-600 dark:text-sky-400">Shipping Control</p>
              <h1 className="mt-3 font-serif text-3xl font-bold text-slate-950 dark:text-white sm:text-4xl">
                Shipping Rates
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Manage the delivery fee matrix for manual checkout. Active province and city combinations are matched automatically on the customer checkout page.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-4 shadow-sm backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/70">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Total</p>
                <p className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">{rates.length}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">locations configured</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/90 px-4 py-4 shadow-sm dark:border-emerald-900/70 dark:bg-emerald-950/40">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">Active</p>
                <p className="mt-2 text-3xl font-bold text-emerald-800 dark:text-emerald-300">{activeRatesCount}</p>
                <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-400/80">used in checkout</p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50/90 px-4 py-4 shadow-sm dark:border-amber-900/70 dark:bg-amber-950/40">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">Inactive</p>
                <p className="mt-2 text-3xl font-bold text-amber-800 dark:text-amber-300">{inactiveRatesCount}</p>
                <p className="mt-1 text-xs text-amber-700/80 dark:text-amber-400/80">saved but hidden</p>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[390px_minmax(0,1fr)]">
          <motion.section
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.34, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="rounded-[24px] bg-slate-950 px-5 py-5 text-white dark:bg-slate-800">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">Add New</p>
              <h2 className="mt-2 text-2xl font-bold">Create shipping rate</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Add a province and city pair with a fee that can immediately power manual checkout.
              </p>
            </div>

            <div className="mt-5 space-y-5">
              <ShippingRateFormFields form={createForm} onFieldChange={updateCreateField} disabled={isCreating} />

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreating ? (
                    <>
                      <ButtonSpinner />
                      Saving...
                    </>
                  ) : 'Add Rate'}
                </button>
                <button
                  type="button"
                  onClick={resetCreateForm}
                  disabled={isCreating}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Reset Form
                </button>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.34, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Directory</p>
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        onChange={toggleSelectAllVisible}
                        disabled={filteredRateIds.length === 0}
                        className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-200"
                      />
                      Select all visible
                    </label>
                  </div>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">Configured Locations</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Browse, update, or remove delivery locations without leaving the page.
                  </p>
                  {selectedRateIds.length > 0 ? (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                        {selectedRateIds.length} selected
                      </span>
                      <button
                        type="button"
                        onClick={clearSelection}
                        className="text-xs font-semibold text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                      >
                        Clear selection
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <label className="relative block">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.5-3.5" />
                      </svg>
                    </span>
                    <input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search province or city"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-sky-900/30 sm:w-80"
                    />
                  </label>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                    {isFetching ? 'Refreshing rates...' : `${filteredRates.length} result${filteredRates.length === 1 ? '' : 's'}`}
                  </div>
                  <button
                    type="button"
                    onClick={() => setBulkDeleteOpen(true)}
                    disabled={selectedRateIds.length === 0 || isDeleting || isBulkDeleting}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                    </svg>
                    Bulk Delete
                  </button>
                </div>
              </div>
            </div>

            <div className="max-h-[760px] overflow-auto p-5">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.9, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                  className="rounded-[24px] border border-dashed border-slate-200 px-6 py-14 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
                >
                  Loading shipping rates...
                </motion.div>
              ) : groupedRates.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.26, ease: 'easeOut' }}
                  className="rounded-[24px] border border-dashed border-slate-200 px-6 py-14 text-center dark:border-slate-700"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <svg className="h-6 w-6 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 7h18" />
                      <path d="M7 12h10" />
                      <path d="M10 17h4" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No matching shipping rates</h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {searchTerm.trim() ? 'Try a different search keyword.' : 'Create your first location from the panel on the left.'}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-5">
                  {groupedRates.map(([province, provinceRates]) => (
                    <motion.div
                      key={province}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-950/40"
                    >
                      <div className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={provinceRates.every((rate) => selectedRateIds.includes(rate.id))}
                            onChange={() => {
                              const provinceIds = provinceRates.map((rate) => rate.id)
                              const allProvinceSelected = provinceIds.every((id) => selectedRateIds.includes(id))

                              setSelectedRateIds((current) => {
                                if (allProvinceSelected) {
                                  const provinceSet = new Set(provinceIds)
                                  return current.filter((id) => !provinceSet.has(id))
                                }

                                const next = new Set(current)
                                provinceIds.forEach((id) => next.add(id))
                                return Array.from(next)
                              })
                            }}
                            className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-200"
                          />
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-sky-500">Province</p>
                          <h3 className="mt-1 text-xl font-bold uppercase tracking-[0.08em] text-slate-950 dark:text-white">
                            {province}
                          </h3>
                        </div>
                        </div>
                        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                          {provinceRates.length} location{provinceRates.length === 1 ? '' : 's'}
                        </div>
                      </div>

                      <div className="grid gap-3 p-4">
                        {provinceRates.map((rate) => {
                          const isDeletingRow = pendingDeleteId === rate.id
                          const isEditingRow = editingRate?.id === rate.id
                          const isSelected = selectedRateIds.includes(rate.id)

                          return (
                          <motion.article
                            key={rate.id}
                            layout
                            whileHover={{ y: -2, scale: 1.002 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className={`rounded-[22px] border border-slate-200 bg-white px-4 py-4 transition hover:border-sky-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 ${
                              isDeletingRow ? 'pointer-events-none opacity-60' : isSelected ? 'ring-2 ring-sky-200 dark:ring-sky-900/50' : ''
                            }`}
                          >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleRateSelected(rate.id)}
                                    disabled={isDeletingRow}
                                    className="mr-1 h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-200"
                                  />
                                  <h4 className="truncate text-lg font-bold text-slate-900 dark:text-white">{rate.city}</h4>
                                  <span
                                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${
                                      rate.status
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                        : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                    }`}
                                  >
                                    {rate.status ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                  Last updated {rate.updatedAt ? rate.updatedAt : 'recently'}
                                </p>
                                {isDeletingRow ? (
                                  <p className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-red-500 dark:text-red-400">
                                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-200 border-t-red-500 dark:border-red-900 dark:border-t-red-400" />
                                    Removing this rate...
                                  </p>
                                ) : null}
                                {isEditingRow && !isDeletingRow ? (
                                  <p className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400">
                                    <span className="inline-block h-2 w-2 rounded-full bg-sky-500" />
                                    Open in edit modal
                                  </p>
                                ) : null}
                              </div>

                              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="rounded-2xl bg-sky-50 px-4 py-3 text-right dark:bg-sky-950/40">
                                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-500">Fee</p>
                                  <p className="mt-1 text-lg font-bold text-sky-700 dark:text-sky-300">{formatPeso(rate.fee)}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(rate)}
                                    disabled={isDeletingRow}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                                  >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M12 20h9" />
                                      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" />
                                    </svg>
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletingRate(rate)}
                                    disabled={isDeletingRow}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/30"
                                  >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M3 6h18" />
                                      <path d="M8 6V4h8v2" />
                                      <path d="M19 6l-1 14H6L5 6" />
                                      <path d="M10 11v6" />
                                      <path d="M14 11v6" />
                                    </svg>
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.article>
                        )})}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </motion.div>

      <ShippingRateModal
        open={Boolean(editingRate)}
        title={editingRate ? `Edit ${editingRate.city}` : 'Edit shipping rate'}
        description="Update the fee or checkout visibility for this location."
        onClose={closeEditModal}
        footer={
          <>
            <button
              type="button"
              onClick={closeEditModal}
              disabled={isUpdating}
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleEditSave}
              disabled={isUpdating}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdating ? (
                <>
                  <ButtonSpinner />
                  Saving...
                </>
              ) : 'Save Changes'}
            </button>
          </>
        }
      >
        <ShippingRateFormFields form={editForm} onFieldChange={updateEditField} disabled={isUpdating} />
      </ShippingRateModal>

      <ShippingRateModal
        open={Boolean(deletingRate)}
        title="Delete shipping rate"
        description="This action removes the location from the shipping matrix."
        onClose={() => setDeletingRate(null)}
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeletingRate(null)}
              disabled={isDeleting}
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Keep Rate
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? (
                <>
                  <ButtonSpinner tone="danger" />
                  Deleting...
                </>
              ) : 'Delete Rate'}
            </button>
          </>
        }
      >
        <div className="rounded-[24px] border border-red-100 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/20">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {deletingRate ? (
              <>
                You are about to delete the rate for <span className="font-bold text-slate-950 dark:text-white">{deletingRate.city}, {deletingRate.province}</span>.
                This location will no longer be available for manual checkout until you create it again.
              </>
            ) : null}
          </p>
        </div>
      </ShippingRateModal>

      <ShippingRateModal
        open={bulkDeleteOpen}
        title="Bulk delete shipping rates"
        description="Delete all currently selected shipping rates in one action."
        onClose={() => !isBulkDeleting && setBulkDeleteOpen(false)}
        footer={
          <>
            <button
              type="button"
              onClick={() => setBulkDeleteOpen(false)}
              disabled={isBulkDeleting}
              className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleBulkDeleteConfirm}
              disabled={isBulkDeleting || selectedRateIds.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isBulkDeleting ? (
                <>
                  <ButtonSpinner tone="danger" />
                  Deleting...
                </>
              ) : `Delete ${selectedRateIds.length} Selected`}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-[24px] border border-red-100 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-950/20">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              You are about to delete <span className="font-bold text-slate-950 dark:text-white">{selectedRateIds.length}</span> shipping rate{selectedRateIds.length === 1 ? '' : 's'}.
              This action removes them from manual checkout until they are created again.
            </p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Selection Summary</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              {selectedVisibleCount} visible result{selectedVisibleCount === 1 ? '' : 's'} selected in the current filter, {selectedRateIds.length} total selected overall.
            </p>
          </div>
        </div>
      </ShippingRateModal>
    </>
  )
}
