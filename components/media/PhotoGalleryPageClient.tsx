'use client'

import { useState } from 'react'
import Image from 'next/image'
import TopBar from '@/components/layout/TopBar'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/landing-page/Footer'
import { useGetPublicWebPageItemsQuery } from '@/store/api/webPagesApi'
import { Skeleton } from '@heroui/react'

type PhotoGalleryPageClientProps = {
  initialCategories?: any[]
}

const SAMPLE_GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Modern Living Room',
    subtitle: 'Contemporary furniture arrangement with elegant decor',
    image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=500&fit=crop',
    is_active: true,
  },
  {
    id: 2,
    title: 'Bedroom Comfort',
    subtitle: 'Cozy bedroom design with premium bedding',
    image_url: 'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=500&h=500&fit=crop',
    is_active: true,
  },
  {
    id: 3,
    title: 'Kitchen Excellence',
    subtitle: 'Modern kitchen with professional appliances',
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop',
    is_active: true,
  },
  {
    id: 4,
    title: 'Dining Experience',
    subtitle: 'Elegant dining room setup',
    image_url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=500&h=500&fit=crop',
    is_active: true,
  },
  {
    id: 5,
    title: 'Home Office',
    subtitle: 'Productive workspace design',
    image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop',
    is_active: true,
  },
  {
    id: 6,
    title: 'Bathroom Spa',
    subtitle: 'Luxurious bathroom with modern fixtures',
    image_url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=500&fit=crop',
    is_active: true,
  },
  {
    id: 7,
    title: 'Living Space',
    subtitle: 'Spacious living area with natural lighting',
    image_url: 'https://images.unsplash.com/photo-1537457905121-5650b2b1c8da?w=500&h=500&fit=crop',
    is_active: true,
  },
  {
    id: 8,
    title: 'Outdoor Patio',
    subtitle: 'Beautiful outdoor entertainment space',
    image_url: 'https://images.unsplash.com/photo-1600493463592-8e36ae95ef56?w=500&h=500&fit=crop',
    is_active: true,
  },
]

export default function PhotoGalleryPageClient({ initialCategories }: PhotoGalleryPageClientProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { data, isLoading } = useGetPublicWebPageItemsQuery('photo-gallery')

  const apiItems = data?.items?.filter((item) => item.is_active) ?? []
  const galleryItems = apiItems.length > 0 ? apiItems : SAMPLE_GALLERY_ITEMS

  return (
    <>
      <TopBar />
      <Navbar initialCategories={initialCategories} />
      <main className="bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-10">
          {/* Header */}
          <div className="mb-10 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-8 md:px-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Photo Gallery</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Explore our collection of premium home and lifestyle images
            </p>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : galleryItems.length === 0 ? (
            /* Empty State */
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                No Photos Available
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Check back soon for our photo collection!
              </p>
            </div>
          ) : (
            /* Gallery Grid */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="group cursor-pointer overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 transition-all hover:border-orange-400 dark:hover:border-orange-400"
                    onClick={() => item.image_url && setSelectedImage(item.image_url)}
                  >
                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.title || 'Gallery image'}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <svg
                            className="h-12 w-12 text-gray-400 dark:text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    {item.title && (
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
                <Image
                  src={selectedImage}
                  alt="Full size gallery image"
                  width={1200}
                  height={800}
                  className="h-auto w-auto max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -right-10 -top-10 text-white hover:text-gray-300 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
