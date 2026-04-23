import { buildPageMetadata } from '@/app/seo'
import ZqSupplierProductsPageMain from '@/components/superAdmin/products/ZqSupplierProductsPageMain'

export const metadata = buildPageMetadata({
  title: 'Supplier ZQ Products',
  description: 'Browse cached ZQ supplier products in the supplier panel.',
  path: '/supplier/products/zq-supplier',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

export default function SupplierZqSupplierProductsPage() {
  return <ZqSupplierProductsPageMain scope="supplier" />
}
