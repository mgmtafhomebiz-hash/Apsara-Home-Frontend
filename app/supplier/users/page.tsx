import { buildPageMetadata } from '@/app/seo'
import SupplierUsersPage from '@/components/supplier/SupplierUsersPage'

export const metadata = buildPageMetadata({
  title: 'Supplier Users',
  description: 'Manage supplier portal users on AF Home.',
  path: '/supplier/users',
  noIndex: true,
})

export default function SupplierUsersRoute() {
  return <SupplierUsersPage />
}
