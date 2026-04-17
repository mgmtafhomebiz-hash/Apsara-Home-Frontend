import { buildPageMetadata } from '@/app/seo'
import ProductsInventoryPageMain from '@/components/superAdmin/products/ProductsInventoryPageMain'

export const metadata = buildPageMetadata({
  title: 'Admin Products Inventory',
  description: 'Browse the Admin Products Inventory page on AF Home.',
  path: '/admin/products/inventory',
  noIndex: true,
})

export default function AdminProductsInventoryPage() {
  return <ProductsInventoryPageMain />
}
