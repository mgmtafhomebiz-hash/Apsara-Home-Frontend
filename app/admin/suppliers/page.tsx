import { buildPageMetadata } from '@/app/seo'
import UnderMaintenancePage from '@/components/superAdmin/UnderMaintenancePage'

export const metadata = buildPageMetadata({
  title: 'Admin Suppliers',
  description: 'Browse the Admin Suppliers page on AF Home.',
  path: '/admin/suppliers',
  noIndex: true,
})

export default function AdminSuppliersPage() {
  return (
    <UnderMaintenancePage
      title="Suppliers"
      description="Supplier management is still under maintenance."
    />
  )
}
