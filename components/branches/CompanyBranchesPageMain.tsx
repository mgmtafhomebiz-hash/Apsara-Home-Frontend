'use client'

import { useMemo } from 'react'
import Navbar from '@/components/layout/Navbar'
import TopBar from '@/components/layout/TopBar'
import Footer from '@/components/landing-page/Footer'
import ScrollToTop from '@/components/landing-page/ScrollToTop'
import { useGetPublicGeneralSettingsQuery } from '@/store/api/adminSettingsApi'
import type { Category } from '@/store/api/categoriesApi'
import { Building2, Factory, MapPin, Store, Navigation, Map as MapIcon } from 'lucide-react'
import OutlineButton from '@/components/ui/buttons/OutlineButton'
import SecondaryButton from '@/components/ui/buttons/SecondaryButton'

type Branch = {
  name: string
  address: string
  google_map_link?: string
  waze_link?: string
}

type BranchTag = 'HEAD OFFICE' | 'FACTORY OUTLET' | 'SM STORE' | 'STORE' | 'BRANCH'

const getBranchTag = (name: string): BranchTag => {
  const normalized = name.trim().toLowerCase()
  if (!normalized) return 'BRANCH'
  if (normalized.includes('head office') || normalized.includes('main office')) return 'HEAD OFFICE'
  if (normalized.includes('factory')) return 'FACTORY OUTLET'
  if (normalized.includes('sm ')) return 'SM STORE'
  if (normalized.includes('store') || normalized.includes('branch')) return 'STORE'
  return 'BRANCH'
}

const tagStyles: Record<BranchTag, { badge: string; icon: typeof Building2 }> = {
  'HEAD OFFICE': { badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/30', icon: Building2 },
  'FACTORY OUTLET': { badge: 'bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/30', icon: Factory },
  'SM STORE': { badge: 'bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-500/30', icon: Store },
  STORE: { badge: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200 dark:bg-fuchsia-500/10 dark:text-fuchsia-200 dark:ring-fuchsia-500/30', icon: Store },
  BRANCH: { badge: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-white/10 dark:text-white/70 dark:ring-white/15', icon: Building2 },
}

const normalizeExternalUrl = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)) return trimmed
  return `https://${trimmed.replace(/^\/+/, '')}`
}

const parseBranches = (raw?: string | null): Branch[] => {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((item) => ({
        name: typeof item?.name === 'string' ? item.name : '',
        address: typeof item?.address === 'string' ? item.address : '',
        google_map_link: typeof item?.google_map_link === 'string' ? item.google_map_link : '',
        waze_link: typeof item?.waze_link === 'string' ? item.waze_link : '',
      }))
      .filter((item) => item.name.trim() || item.address.trim())
  } catch {
    return []
  }
}

export default function CompanyBranchesPageMain({ initialCategories = [] }: { initialCategories?: Category[] }) {
  const { data, isFetching } = useGetPublicGeneralSettingsQuery()
  const settings = data?.settings
  const branches = useMemo(() => parseBranches(settings?.branches), [settings?.branches])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <TopBar />
      <Navbar initialCategories={initialCategories} />

      <main>
        <section className="relative overflow-hidden border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-orange-600 dark:text-orange-400">Company</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
                Our Branches
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400 md:text-base">
                Find the nearest AF Home branch and open directions instantly using Google Maps or Waze.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 md:py-12">
          {isFetching ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading branches...</p>
          ) : branches.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {branches.map((branch, index) => {
                const query = (branch.address || branch.name).trim()
                const googleHref = branch.google_map_link?.trim()
                  ? normalizeExternalUrl(branch.google_map_link)
                  : query
                    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
                    : ''
                const wazeHref = branch.waze_link?.trim()
                  ? normalizeExternalUrl(branch.waze_link)
                  : query
                    ? `https://waze.com/ul?q=${encodeURIComponent(query)}&navigate=yes`
                    : ''

                const tag = getBranchTag(branch.name)
                const { badge, icon: TagIcon } = tagStyles[tag]

                return (
                  <div
                    key={`${branch.name}-${index}`}
                    className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 transition hover:border-orange-200 dark:hover:border-orange-800"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] ring-1 ${badge}`}>
                        {tag}
                      </span>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 transition group-hover:bg-orange-50 group-hover:border-orange-200 dark:group-hover:bg-orange-900/20 dark:group-hover:border-orange-800">
                        <TagIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      </span>
                    </div>

                    <p className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                      {branch.name || `Branch ${index + 1}`}
                    </p>
                    {branch.address ? (
                      <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500 dark:text-orange-400" />
                        <span>{branch.address}</span>
                      </p>
                    ) : null}

                    <div className="mt-5 flex flex-wrap gap-2">
                      {googleHref ? (
                        <SecondaryButton
                          onClick={() => window.open(googleHref, '_blank')}
                          className="!px-4 !py-2 !text-xs !rounded-full"
                        >
                          <MapIcon className="h-4 w-4" />
                          <span>Google Maps</span>
                        </SecondaryButton>
                      ) : null}
                      {wazeHref ? (
                        <OutlineButton
                          onClick={() => window.open(wazeHref, '_blank')}
                          className="!px-4 !py-2 !text-xs !rounded-full"
                        >
                          <Navigation className="h-4 w-4" />
                          <span>Waze</span>
                        </OutlineButton>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6 text-sm text-gray-600 dark:text-gray-400">
              No branches have been added yet.
            </div>
          )}
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  )
}
