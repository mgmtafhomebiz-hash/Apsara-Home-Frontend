import { buildPageMetadata } from '@/app/seo'
import UnderMaintenancePage from '@/components/superAdmin/UnderMaintenancePage'

export const metadata = buildPageMetadata({
  title: 'Admin Member Report',
  description: 'Browse the Admin Member Report page on AF Home.',
  path: '/admin/reports/members',
  noIndex: true,
})

export default function AdminReportsMembersPage() {
  return (
    <UnderMaintenancePage
      title="Member Report"
      description="Member analytics and reporting are still under maintenance."
    />
  )
}
