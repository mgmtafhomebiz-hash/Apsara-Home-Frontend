'use client'

import TopBar from '@/components/layout/TopBar'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/landing-page/Footer'

type VideoGalleryPageClientProps = {
  initialCategories?: any[]
}

export default function VideoGalleryPageClient({ initialCategories }: VideoGalleryPageClientProps) {

  return (
    <>
      <TopBar />
      <Navbar initialCategories={initialCategories} />
      <main className="bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-10">
          {/* Header */}
          <div className="mb-10 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-8 md:px-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Video Gallery</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Explore our collection of premium home and lifestyle videos
            </p>
          </div>

          {/* Empty State */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-8 py-16 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Video Gallery Coming Soon
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              We're preparing our collection of videos. Check back soon!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
