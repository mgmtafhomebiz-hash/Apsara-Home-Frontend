'use client'

import { useMemo } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/landing-page/Footer'
import ScrollToTop from '@/components/landing-page/ScrollToTop'
import { useGetPublicGeneralSettingsQuery } from '@/store/api/adminSettingsApi'
import type { Category } from '@/store/api/categoriesApi'
import { Building2, Factory, MapPin, Store, Navigation, Map as MapIcon } from 'lucide-react'

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
      <Navbar initialCategories={initialCategories} />

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-white dark:border-white/10 dark:from-gray-950 dark:via-gray-950 dark:to-gray-950">
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-orange-200/40 blur-3xl dark:bg-orange-500/10" />
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/10" />
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-orange-600">Company</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
                Our Branches
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-white/70 md:text-base">
                Find the nearest AF Home branch and open directions instantly using Google Maps or Waze.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 md:py-12">
          {isFetching ? (
            <p className="text-sm text-slate-500 dark:text-white/60">Loading branches...</p>
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
                    className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-slate-100 blur-2xl transition group-hover:bg-orange-100 dark:bg-white/5 dark:group-hover:bg-orange-500/10" />

                    <div className="flex items-center justify-between gap-3">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] ring-1 ${badge}`}>
                        {tag}
                      </span>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200 transition group-hover:bg-orange-50 group-hover:ring-orange-200 dark:bg-white/5 dark:ring-white/10 dark:group-hover:bg-orange-500/10 dark:group-hover:ring-orange-500/20">
                        <TagIcon className="h-5 w-5 text-slate-700 dark:text-white/80" />
                      </span>
                    </div>

                    <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                      {branch.name || `Branch ${index + 1}`}
                    </p>
                    {branch.address ? (
                      <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-slate-600 dark:text-white/70">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                        <span>{branch.address}</span>
                      </p>
                    ) : null}

                    <div className="mt-5 flex flex-wrap gap-2">
                      {googleHref ? (
                        <a
                          href={googleHref}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-800 ring-1 ring-slate-200 transition hover:bg-slate-200 dark:bg-white/10 dark:text-white/80 dark:ring-white/15 dark:hover:bg-white/15"
                        >
                          <MapIcon className="h-4 w-4" />
                          Google Maps
                        </a>
                      ) : null}
                      {wazeHref ? (
                        <a
                          href={wazeHref}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                        >
                          <Navigation className="h-4 w-4" />
                          Waze
                        </a>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
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
