import { buildPageMetadata } from '@/app/seo'
import PartnerStorefrontStudio from '@/components/superAdmin/webpages/PartnerStorefrontStudio'

export const metadata = buildPageMetadata({
  title: 'Partner Storefronts',
  description: 'Manage your partner storefront settings.',
  path: '/partner/webpages/partner-storefronts',
  noIndex: true,
})

export default function PartnerStorefrontsPage() {
  return <PartnerStorefrontStudio />
}
