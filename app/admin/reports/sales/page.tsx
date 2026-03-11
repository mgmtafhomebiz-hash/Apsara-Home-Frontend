import { buildPageMetadata } from '@/app/seo'
import UnderMaintenancePage from '@/components/superAdmin/UnderMaintenancePage'

export const metadata = buildPageMetadata({
  title: 'Admin Sales Report',
  description: 'Browse the Admin Sales Report page on AF Home.',
  path: '/admin/reports/sales',
  noIndex: true,
})

export default function AdminReportsSalesPage() {
  return (
    <UnderMaintenancePage
      title="Sales Report"
      description="Sales reporting tools are still being prepared."
    />
  )
}
