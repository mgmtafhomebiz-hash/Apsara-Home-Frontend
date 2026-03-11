import { buildPageMetadata } from '@/app/seo'
import UnderMaintenancePage from '@/components/superAdmin/UnderMaintenancePage'

export const metadata = buildPageMetadata({
  title: 'Admin Financial Report',
  description: 'Browse the Admin Financial Report page on AF Home.',
  path: '/admin/reports/financial',
  noIndex: true,
})

export default function AdminReportsFinancialPage() {
  return (
    <UnderMaintenancePage
      title="Financial Report"
      description="Financial reporting tools are still under construction."
    />
  )
}
