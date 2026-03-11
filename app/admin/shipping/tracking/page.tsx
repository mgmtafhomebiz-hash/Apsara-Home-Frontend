import { buildPageMetadata } from '@/app/seo'
import UnderMaintenancePage from '@/components/superAdmin/UnderMaintenancePage'

export const metadata = buildPageMetadata({
  title: 'Admin Shipping Tracking',
  description: 'Browse the Admin Shipping Tracking page on AF Home.',
  path: '/admin/shipping/tracking',
  noIndex: true,
})

export default function AdminShippingTrackingPage() {
  return (
    <UnderMaintenancePage
      title="Shipment Tracking"
      description="Tracking updates and shipment monitoring tools are still under construction."
    />
  )
}
