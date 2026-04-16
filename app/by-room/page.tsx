import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'By Room', description: 'Browse the By Room page on AF Home.', path: '/by-room' });

export default function ByRoomPage() {
  return (
    <>
      <div 
        className="fixed inset-0 -z-50 by-room-background"
        style={{ 
          backgroundColor: '#faf8f5',
          background: '#faf8f5'
        } as React.CSSProperties}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          html.dark .by-room-background {
            background-color: #030712 !important;
            background: #030712 !important;
          }
        `
      }} />
      <main className="relative container mx-auto px-4 py-16 min-h-screen">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Shop By Room</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">Choose a room from the navigation dropdown to browse products.</p>
      </main>
    </>
  )
}