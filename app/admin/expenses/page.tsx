import { buildPageMetadata } from '@/app/seo'
import ExpensesPageMain from '@/components/superAdmin/expenses/ExpensesPageMain'

export const metadata = buildPageMetadata({
  title: 'Admin Expenses',
  description: 'Browse the Admin Expenses page on AF Home.',
  path: '/admin/expenses',
  noIndex: true,
})

export default function AdminExpensesPage() {
  return <ExpensesPageMain />
}
