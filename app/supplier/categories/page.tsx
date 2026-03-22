import { buildPageMetadata } from '@/app/seo'
import SupplierCategoriesPage from '@/components/supplier/SupplierCategoriesPage'

export const metadata = buildPageMetadata({
  title: 'Supplier Categories',
  description: 'View assigned supplier categories on AF Home.',
  path: '/supplier/categories',
  noIndex: true,
})

export default function SupplierCategoriesRoute() {
  return <SupplierCategoriesPage />
}
