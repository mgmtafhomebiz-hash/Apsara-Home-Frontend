import { buildPageMetadata } from '@/app/seo'
import UnderMaintenancePage from '@/components/superAdmin/UnderMaintenancePage'

export const metadata = buildPageMetadata({
  title: 'Admin Products Reviews',
  description: 'Browse the Admin Products Reviews page on AF Home.',
  path: '/admin/products/reviews',
  noIndex: true,
})

export default function AdminProductsReviewsPage() {
  return (
    <UnderMaintenancePage
      title="Product Reviews"
      description="Review moderation and product feedback tools are still being built."
    />
  )
}
