import { buildPageMetadata } from '@/app/seo'
import UnderMaintenancePage from '@/components/superAdmin/UnderMaintenancePage'

export const metadata = buildPageMetadata({
  title: 'Admin Expense Categories',
  description: 'Browse the Admin Expense Categories page on AF Home.',
  path: '/admin/expenses/categories',
  noIndex: true,
})

export default function AdminExpenseCategoriesPage() {
  return (
    <UnderMaintenancePage
      title="Expense Categories"
      description="Expense category management is still being built."
    />
  )
}
