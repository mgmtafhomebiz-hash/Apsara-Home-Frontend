import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'By Brand', description: 'Browse the By Brand page on AF Home.', path: '/by-brand' });

export default function ByBrandPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold text-gray-900">Shop By Brand</h1>
      <p className="mt-3 text-gray-600">This page is under construction.</p>
    </main>
  )
}