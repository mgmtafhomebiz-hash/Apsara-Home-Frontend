import { buildPageMetadata } from '@/app/seo'
import PartnerStorefrontStudio from '@/components/superAdmin/webpages/PartnerStorefrontStudio'

export const metadata = buildPageMetadata({
  title: 'Partner Storefronts',
  description: 'Manage branded partner shop pages and their visible catalog.',
  path: '/admin/webpages/partner-storefronts',
  noIndex: true,
})

export default function AdminPartnerStorefrontsPage() {
  return <PartnerStorefrontStudio />
}
