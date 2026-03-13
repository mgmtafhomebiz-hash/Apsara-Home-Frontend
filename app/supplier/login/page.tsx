import { buildPageMetadata } from '@/app/seo'
import SupplierLoginForm from '@/components/supplier/SupplierLoginForm'

export const metadata = buildPageMetadata({
  title: 'Supplier Login',
  description: 'Sign in to the AF Home supplier portal.',
  path: '/supplier/login',
  noIndex: true,
})

export default function SupplierLoginPage() {
  return <SupplierLoginForm />
}
