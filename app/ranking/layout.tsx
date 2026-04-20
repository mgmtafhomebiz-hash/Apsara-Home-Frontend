import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Top Earners Rankings | AFHOME',
  description: 'View top earning affiliates and members on AFHOME platform',
}

export default function RankingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div style={{ colorScheme: 'light', fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' }}>
        {children}
      </div>
    </>
  )
}
