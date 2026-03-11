import { buildPageMetadata } from '@/app/seo'
import UnderMaintenancePage from '@/components/superAdmin/UnderMaintenancePage'

export const metadata = buildPageMetadata({
  title: 'Admin Members Exports',
  description: 'Browse the Admin Members Exports page on AF Home.',
  path: '/admin/members/exports',
  noIndex: true,
})

export default function AdminMembersExportsPage() {
  return (
    <UnderMaintenancePage
      title="Members Export Center"
      description="Bulk member export tools are still being prepared."
    />
  )
}
