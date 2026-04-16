import { buildPageMetadata } from '@/app/seo'
import PaymentsPageMain from '@/components/superAdmin/payments/PaymentsPageMain'

export const metadata = buildPageMetadata({
  title: 'Admin Payments',
  description: 'Browse the Admin Payments page on AF Home.',
  path: '/admin/payments',
  noIndex: true,
})

export default function AdminPaymentsPage() {
  return <PaymentsPageMain />
}
