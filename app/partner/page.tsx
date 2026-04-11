import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { buildPageMetadata } from '@/app/seo'
import { adminAuthOptions } from '@/libs/adminAuth'

export const metadata = buildPageMetadata({
  title: 'Partner Portal',
  description: 'Manage your partner storefront.',
  path: '/partner',
  noIndex: true,
})

export default async function PartnerIndexPage() {
  const session = await getServerSession(adminAuthOptions)

  if (!session?.user) {
    redirect('/partner/login')
  }

  redirect('/partner/webpages/partner-storefronts')
}
