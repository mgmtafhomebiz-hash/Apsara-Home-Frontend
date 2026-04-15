import { buildPageMetadata } from '@/app/seo'
import ExpenseCategoriesPageMain from '@/components/superAdmin/expenses/ExpenseCategoriesPageMain'

export const metadata = buildPageMetadata({
  title: 'Admin Expense Categories',
  description: 'Browse the Admin Expense Categories page on AF Home.',
  path: '/admin/expenses/categories',
  noIndex: true,
})

export default function AdminExpenseCategoriesPage() {
  return <ExpenseCategoriesPageMain />
}
