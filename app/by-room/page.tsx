import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'By Room', description: 'Browse the By Room page on AF Home.', path: '/by-room' });

export default function ByRoomPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold text-gray-900">Shop By Room</h1>
      <p className="mt-3 text-gray-600">Choose a room from the navigation dropdown to browse products.</p>
    </main>
  )
}