import { buildPageMetadata } from '@/app/seo'
import AddsContentClient from './AddsContentClient'

export const metadata = buildPageMetadata({
  title: 'Adds Content',
  description: 'Manage advertising placements and sponsored content blocks.',
  path: '/admin/webpages/adds-content',
  noIndex: true,
})

export default function AdminAddsContentPage() {
  return <AddsContentClient />
}
