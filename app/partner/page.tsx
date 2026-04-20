import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { buildPageMetadata } from '@/app/seo'
import { partnerAuthOptions } from '@/libs/partnerAuth'

export const metadata = buildPageMetadata({
  title: 'Partner Portal',
  description: 'Manage your partner storefront.',
  path: '/partner',
  noIndex: true,
})

export default async function PartnerIndexPage() {
  const session = await getServerSession(partnerAuthOptions)

  if (!session?.user) {
    redirect('/partner/login')
  }

  redirect('/partner/webpages/partner-storefronts')
}
