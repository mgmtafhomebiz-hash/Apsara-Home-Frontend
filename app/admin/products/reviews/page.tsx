import { buildPageMetadata } from '@/app/seo'
import ProductsReviewsPageMain from '@/components/superAdmin/products/ProductsReviewsPageMain'

export const metadata = buildPageMetadata({
  title: 'Admin Products Reviews',
  description: 'Browse the Admin Products Reviews page on AF Home.',
  path: '/admin/products/reviews',
  noIndex: true,
})

export default function AdminProductsReviewsPage() {
  return <ProductsReviewsPageMain />
}
