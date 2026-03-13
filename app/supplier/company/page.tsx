import { buildPageMetadata } from '@/app/seo'
import SuppliersPageMain from '@/components/superAdmin/suppliers/SuppliersPageMain'

export const metadata = buildPageMetadata({
  title: 'Supplier Company',
  description: 'Browse your supplier company profile on AF Home.',
  path: '/supplier/company',
  noIndex: true,
})

export default function SupplierCompanyPage() {
  return <SuppliersPageMain />
}
