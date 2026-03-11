import { buildPageMetadata } from '@/app/seo'
import UnderMaintenancePage from '@/components/superAdmin/UnderMaintenancePage'

export const metadata = buildPageMetadata({
  title: 'Admin Gift Cards',
  description: 'Browse the Admin Gift Cards page on AF Home.',
  path: '/admin/payments/giftcards',
  noIndex: true,
})

export default function AdminPaymentsGiftCardsPage() {
  return (
    <UnderMaintenancePage
      title="Gift Cards"
      description="Gift card management is still under construction."
    />
  )
}
