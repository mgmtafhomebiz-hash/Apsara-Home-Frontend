import { buildPageMetadata } from '@/app/seo'
import UnderMaintenancePage from '@/components/superAdmin/UnderMaintenancePage'

export const metadata = buildPageMetadata({
  title: 'Admin E-Wallet Payments',
  description: 'Browse the Admin E-Wallet Payments page on AF Home.',
  path: '/admin/payments/ewallet',
  noIndex: true,
})

export default function AdminPaymentsEwalletPage() {
  return (
    <UnderMaintenancePage
      title="E-Wallet Payments"
      description="E-wallet transaction monitoring is still being prepared."
    />
  )
}
