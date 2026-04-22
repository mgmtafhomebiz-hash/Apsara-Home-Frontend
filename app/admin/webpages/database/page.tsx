import { buildPageMetadata } from '@/app/seo'
import DatabaseExportPage from '@/components/superAdmin/webpages/DatabaseExportPage'

export const metadata = buildPageMetadata({
  title: 'Database Export',
  description: 'Export database snapshots from the web content workspace.',
  path: '/admin/webpages/database',
  noIndex: true,
})

export default function AdminDatabaseExportPage() {
  return <DatabaseExportPage />
}

