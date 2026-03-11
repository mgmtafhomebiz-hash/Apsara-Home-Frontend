import { buildPageMetadata } from '@/app/seo'
import UnderMaintenancePage from '@/components/superAdmin/UnderMaintenancePage'

export const metadata = buildPageMetadata({
  title: 'Admin Shipping Couriers',
  description: 'Browse the Admin Shipping Couriers page on AF Home.',
  path: '/admin/shipping/couriers',
  noIndex: true,
})

export default function AdminShippingCouriersPage() {
  return (
    <UnderMaintenancePage
      title="Couriers"
      description="Courier management and assignment tools are still being finalized."
    />
  )
}
