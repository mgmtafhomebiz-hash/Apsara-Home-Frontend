import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Media', description: 'Browse the Media page on AF Home.', path: '/media' });

export default function MediaPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold text-gray-900">Media</h1>
      <p className="mt-3 text-gray-600">Select a media section from the navigation menu.</p>
    </main>
  )
}