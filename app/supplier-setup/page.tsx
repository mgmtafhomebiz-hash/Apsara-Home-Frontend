import { buildPageMetadata } from '@/app/seo'
import SupplierInviteSetupForm from '@/components/supplier/SupplierInviteSetupForm'

export const metadata = buildPageMetadata({
  title: 'Supplier Account Setup',
  description: 'Verify your supplier invite and set your password.',
  path: '/supplier-setup',
  noIndex: true,
})

export default async function SupplierSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams
  const token = (params?.token ?? '').trim()

  return <SupplierInviteSetupForm token={token} />
}
