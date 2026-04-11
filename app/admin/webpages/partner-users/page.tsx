import { buildPageMetadata } from '@/app/seo'
import PartnerUsersPage from '@/components/superAdmin/webpages/PartnerUsersPage'

export const metadata = buildPageMetadata({
  title: 'Partner Users',
  description: 'Manage partner storefront user accounts.',
  path: '/admin/webpages/partner-users',
  noIndex: true,
})

export default function AdminPartnerUsersPage() {
  return <PartnerUsersPage />
}
