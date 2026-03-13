import { buildPageMetadata } from '@/app/seo'
import SupplierDashboardHome from '@/components/superAdmin/dashboard/SupplierDashboardHome'

export const metadata = buildPageMetadata({
  title: 'Supplier Dashboard',
  description: 'Browse the supplier dashboard on AF Home.',
  path: '/supplier/dashboard',
  noIndex: true,
})

export default function SupplierDashboardPage() {
  return <SupplierDashboardHome />
}
