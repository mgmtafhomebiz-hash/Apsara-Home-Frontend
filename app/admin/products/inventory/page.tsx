import { buildPageMetadata } from '@/app/seo'
import UnderMaintenancePage from '@/components/superAdmin/UnderMaintenancePage'

export const metadata = buildPageMetadata({
  title: 'Admin Products Inventory',
  description: 'Browse the Admin Products Inventory page on AF Home.',
  path: '/admin/products/inventory',
  noIndex: true,
})

export default function AdminProductsInventoryPage() {
  return (
    <UnderMaintenancePage
      title="Product Inventory"
      description="Inventory management tools are still under maintenance."
    />
  )
}
