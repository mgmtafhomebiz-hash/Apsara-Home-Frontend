import { buildPageMetadata } from '@/app/seo'
import InteriorRequestsPageMain from '@/components/superAdmin/interiorRequests/InteriorRequestsPageMain'

export const metadata = buildPageMetadata({
  title: 'Admin Interior Requests',
  description: 'Browse and manage interior service requests on AF Home.',
  path: '/admin/interior-requests',
  noIndex: true,
})

export default function AdminInteriorRequestsPage() {
  return <InteriorRequestsPageMain />
}
