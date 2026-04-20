import { Metadata } from 'next'
import RankingPageClient from '@/components/ranking/RankingPageClient'

export const metadata: Metadata = {
  title: 'Top Earners Rankings | AFHOME',
  description: 'View top earning affiliates and members on AFHOME platform',
}

export default function RankingPage() {
  return <RankingPageClient />
}
