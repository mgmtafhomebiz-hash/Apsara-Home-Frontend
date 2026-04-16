import { buildPageMetadata } from '@/app/seo'
import PaymentsVouchersPageMain from '@/components/superAdmin/payments/PaymentsVouchersPageMain'

export const metadata = buildPageMetadata({
  title: 'Admin Vouchers',
  description: 'Browse the Admin Vouchers page on AF Home.',
  path: '/admin/payments/giftcards',
  noIndex: true,
})

export default function AdminPaymentsGiftCardsPage() {
  return <PaymentsVouchersPageMain />
}
