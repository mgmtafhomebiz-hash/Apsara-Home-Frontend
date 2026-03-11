import { buildPageMetadata } from '@/app/seo'
import UnderMaintenancePage from '@/components/superAdmin/UnderMaintenancePage'

export const metadata = buildPageMetadata({
  title: 'Admin Payments',
  description: 'Browse the Admin Payments page on AF Home.',
  path: '/admin/payments',
  noIndex: true,
})

export default function AdminPaymentsPage() {
  return (
    <UnderMaintenancePage
      title="Payments"
      description="Payment transaction tools are still under maintenance."
    />
  )
}
