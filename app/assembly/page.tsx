import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Assembly', description: 'Browse the Assembly page on AF Home.', path: '/assembly' });

export default function AssemblyGuidesPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold text-gray-900">Assembly Guides</h1>
      <p className="mt-3 text-gray-600">This page is under construction.</p>
    </main>
  )
}