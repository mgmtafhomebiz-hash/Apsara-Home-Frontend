import { buildPageMetadata } from '@/app/seo'
import AdminShippingRatesPageMain from '@/components/superAdmin/shipping/AdminShippingRatesPageMain'

export const metadata = buildPageMetadata({
  title: 'Admin Shipping Rates',
  description: 'Browse the Admin Shipping Rates page on AF Home.',
  path: '/admin/shipping/rates',
  noIndex: true,
})

export default function AdminShippingRatesPage() {
  return <AdminShippingRatesPageMain />
}
