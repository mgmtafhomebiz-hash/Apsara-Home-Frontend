import { Suspense } from 'react'
import { buildPageMetadata } from '@/app/seo'
import ByBrandPageMain from '@/components/brand/ByBrandPageMain'
import TopBar from '@/components/layout/TopBar'
import Navbar from '@/components/layout/Navbar'
import { getNavbarCategories } from '@/libs/serverStorefront'

export const metadata = buildPageMetadata({ title: 'By Brand', description: 'Browse the By Brand page on AF Home.', path: '/by-brand' })

function ByBrandLoadingFallback() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
      <div className="container mx-auto px-4">
        {/* Header skeleton */}
        <div className="mb-8 space-y-3">
          <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-5 w-96 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>

        {/* Brands grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="h-20 w-20 shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="mt-3 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function ByBrandPage() {
  const navbarCategories = await getNavbarCategories()

  return (
    <>
      <TopBar />
      <Navbar initialCategories={navbarCategories} />
      <Suspense fallback={<ByBrandLoadingFallback />}>
        <ByBrandPageMain />
      </Suspense>
    </>
  )
}
