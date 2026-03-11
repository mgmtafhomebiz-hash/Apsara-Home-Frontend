import { buildPageMetadata } from '@/app/seo'
import UnderMaintenancePage from '@/components/superAdmin/UnderMaintenancePage'

export const metadata = buildPageMetadata({
  title: 'Admin Shipping Rates',
  description: 'Browse the Admin Shipping Rates page on AF Home.',
  path: '/admin/shipping/rates',
  noIndex: true,
})

export default function AdminShippingRatesPage() {
  return (
    <UnderMaintenancePage
      title="Shipping Rates"
      description="Shipping rate configuration is still under maintenance."
    />
  )
}
