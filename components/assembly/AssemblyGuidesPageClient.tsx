'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useGetPublicWebPageItemsQuery } from '@/store/api/webPagesApi'

type LocalAssemblyGuide = {
  id: string
  title: string
  folder: string
  href: string
}

type Props = {
  localGuides?: LocalAssemblyGuide[]
}

export default function AssemblyGuidesPageClient({ localGuides = [] }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState<'a-z' | 'z-a'>('a-z')
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useGetPublicWebPageItemsQuery('assembly-guides')
  const items = useMemo(() => {
    const adminItems = data?.items ?? []
    const localItems = localGuides.map((guide) => ({
      id: `local-${guide.id}`,
      title: guide.title,
      key: guide.folder,
      image_url: null,
      button_text: 'Open Assembly Guide',
      link_url: guide.href,
    }))

    const normalizedAdminItems = adminItems.map((item) => ({
      ...item,
      id: `admin-${item.id}`,
      button_text:
        item.button_text && item.button_text !== 'Open PDF'
          ? item.button_text
          : 'Open Assembly Guide',
    }))

    const seenLinks = new Set<string>()
    const baseItems = [...localItems, ...normalizedAdminItems].filter((item) => {
      const link = String(item.link_url ?? '').trim().toLowerCase()
      if (!link) return true
      if (seenLinks.has(link)) return false
      seenLinks.add(link)
      return true
    })

    const query = search.trim().toLowerCase()
    const filtered = !query ? baseItems : baseItems.filter((item) => {
      const title = String(item.title ?? '').toLowerCase()
      const key = String(item.key ?? '').toLowerCase()
      return title.includes(query) || key.includes(query)
    })

    return [...filtered].sort((a, b) => {
      const left = String(a.title ?? '').localeCompare(String(b.title ?? ''), undefined, { sensitivity: 'base' })
      return sortOrder === 'a-z' ? left : left * -1
    })
  }, [data?.items, localGuides, search, sortOrder])

  const ITEMS_PER_PAGE = 9
  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return items.slice(start, start + ITEMS_PER_PAGE)
  }, [currentPage, items])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleSortChange = (value: 'a-z' | 'z-a') => {
    setSortOrder(value)
    setPage(1)
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
      return
    }
    router.push('/')
  }

  return (
    
    <main className="bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.12),_transparent_38%),linear-gradient(180deg,_#fff7ed_0%,_#ffffff_28%,_#fffaf5_100%)]">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="container mx-auto px-4 pt-14 pb-8"
      >
        <div className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white/90 shadow-[0_24px_80px_rgba(249,115,22,0.10)]">
          <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-10 md:py-12">
            <div>
              <button
                type="button"
                onClick={handleBack}
                className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-orange-500 transition hover:text-orange-600"
              >
                ← Back
              </button>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-orange-500">All Assembly Guides</p>
              <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                All Assembly Guides
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                Open the PDF guide you need and view the setup instructions right away.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="container mx-auto px-4 pb-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
          className="mb-6 rounded-[1.75rem] border border-orange-100 bg-white/90 p-4 shadow-sm"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-500">Assembly Library</p>
              <p className="mt-1 text-sm text-slate-500">
                {items.length.toLocaleString()} guide{items.length !== 1 ? 's' : ''} available
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative w-full md:w-72">
                <svg
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search Assembly guide..."
                  className="w-full rounded-2xl border border-orange-100 bg-orange-50/50 px-10 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
                />
                {search ? (
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ) : null}
              </div>

              <select
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value as 'a-z' | 'z-a')}
                className="rounded-2xl border border-orange-100 bg-orange-50/50 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
              >
                <option value="a-z">A to Z</option>
                <option value="z-a">Z to A</option>
              </select>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-[1.75rem] border border-orange-100 bg-white/80" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-[1.75rem] border border-red-200 bg-red-50 px-6 py-8 text-sm text-red-700">
            Failed to load assembly guides.
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-orange-200 bg-white/80 px-6 py-10 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              {search.trim() ? 'No matching assembly guides' : 'No assembly guides yet'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {search.trim()
                ? 'Try a different file name or folder keyword.'
                : 'Add PDFs under the public assembly guides folder or create guide links from admin.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <motion.div
              key={`assembly-page-${currentPage}-${sortOrder}-${search}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
              {paginatedItems.map((item) => {
              const card = (
                <motion.article
                  initial={{ opacity: 0, y: 18, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex h-full flex-col rounded-[1.75rem] border border-orange-100 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(249,115,22,0.14)]"
                >
                  <div className="rounded-t-[1.75rem] border-b border-orange-100 bg-[linear-gradient(135deg,_#fff7ed,_#fffbf5_45%,_#ffedd5)] p-6">
                    <div className="flex items-start justify-between gap-4">
                      <motion.div
                        whileHover={{ rotate: -6, scale: 1.05 }}
                        transition={{ duration: 0.18 }}
                        className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-sm ring-1 ring-orange-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <path d="M14 2v6h6" />
                          <path d="M9 15h6" />
                          <path d="M9 11h2" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
                        {item.key || 'Assembly Guide'}
                      </p>
                      <h2 className="mt-3 text-xl font-bold leading-tight text-slate-900">
                        {item.title || 'Assembly Guide'}
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        Click to open the assembly guide.
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-sm font-semibold text-orange-600">
                        {item.button_text || 'Open Assembly Guide'}
                      </span>
                      <motion.span
                        whileHover={{ x: 3, y: -3 }}
                        transition={{ duration: 0.16 }}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M7 17 17 7" />
                          <path d="M8 7h9v9" />
                        </svg>
                      </motion.span>
                    </div>
                  </div>
                </motion.article>
              )

              return item.link_url ? (
                <Link
                  key={item.id}
                  href={item.link_url}
                  target={item.link_url.startsWith('http') ? '_blank' : undefined}
                  rel={item.link_url.startsWith('http') ? 'noreferrer' : undefined}
                  className="block h-full"
                >
                  {card}
                </Link>
              ) : (
                <div key={item.id} className="h-full">
                  {card}
                </div>
              )
              })}
            </motion.div>

            {totalPages > 1 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.14 }}
                className="flex flex-col items-center justify-between gap-3 rounded-[1.5rem] border border-orange-100 bg-white/90 px-4 py-4 shadow-sm md:flex-row"
              >
                <p className="text-sm text-slate-500">
                  Page <span className="font-semibold text-slate-800">{currentPage}</span> of{' '}
                  <span className="font-semibold text-slate-800">{totalPages}</span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage <= 1}
                    className="rounded-xl border border-orange-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage >= totalPages}
                    className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            ) : null}
          </div>
        )}
      </motion.section>
    </main>
  )
}


