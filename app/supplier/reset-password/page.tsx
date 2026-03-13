import { buildPageMetadata } from '@/app/seo'
import SupplierResetPasswordForm from '@/components/supplier/SupplierResetPasswordForm'

export const metadata = buildPageMetadata({
  title: 'Supplier Reset Password',
  description: 'Reset your AF Home supplier portal password.',
  path: '/supplier/reset-password',
  noIndex: true,
})

export default async function SupplierResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams
  const token = (params?.token ?? '').trim()

  return <SupplierResetPasswordForm token={token} />
}
