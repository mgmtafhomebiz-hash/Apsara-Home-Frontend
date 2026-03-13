import { buildPageMetadata } from '@/app/seo'
import SupplierForgotPasswordForm from '@/components/supplier/SupplierForgotPasswordForm'

export const metadata = buildPageMetadata({
  title: 'Supplier Forgot Password',
  description: 'Request a password reset for your AF Home supplier portal account.',
  path: '/supplier/forgot-password',
  noIndex: true,
})

export default function SupplierForgotPasswordPage() {
  return <SupplierForgotPasswordForm />
}
