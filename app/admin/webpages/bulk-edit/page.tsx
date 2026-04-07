import { buildPageMetadata } from '@/app/seo'
import BulkEditClient from './BulkEditClient'

export const metadata = buildPageMetadata({
  title: 'Web Content Bulk Edit',
  description: 'Bulk edit web content entries in one streamlined workspace.',
  path: '/admin/webpages/bulk-edit',
  noIndex: true,
})

export default function AdminWebContentBulkEditPage() {
  return <BulkEditClient />
}
