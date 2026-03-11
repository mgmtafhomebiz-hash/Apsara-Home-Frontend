import { buildPageMetadata } from '@/app/seo'
import UnderMaintenancePage from '@/components/superAdmin/UnderMaintenancePage'

export const metadata = buildPageMetadata({
  title: 'Admin Expenses',
  description: 'Browse the Admin Expenses page on AF Home.',
  path: '/admin/expenses',
  noIndex: true,
})

export default function AdminExpensesPage() {
  return (
    <UnderMaintenancePage
      title="Expenses"
      description="Expense monitoring and entry tools are still under construction."
    />
  )
}
