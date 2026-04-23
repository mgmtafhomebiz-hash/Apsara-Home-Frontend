import { buildPageMetadata } from '@/app/seo'
import ZqSupplierProductsPageMain from '@/components/superAdmin/products/ZqSupplierProductsPageMain'

export const metadata = buildPageMetadata({
  title: 'Admin ZQ Supplier Products',
  description: 'Browse cached ZQ supplier products in the admin panel.',
  path: '/admin/products/zq-supplier',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

export default function AdminZqSupplierProductsPage() {
  return <ZqSupplierProductsPageMain scope="admin" />
}
