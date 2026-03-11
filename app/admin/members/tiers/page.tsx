import { buildPageMetadata } from '@/app/seo'
import UnderMaintenancePage from '@/components/superAdmin/UnderMaintenancePage'

export const metadata = buildPageMetadata({
  title: 'Admin Members Tiers',
  description: 'Browse the Admin Members Tiers page on AF Home.',
  path: '/admin/members/tiers',
  noIndex: true,
})

export default function AdminMembersTiersPage() {
  return (
    <UnderMaintenancePage
      title="Member Tiers / Levels"
      description="Tier setup and level management are still under construction."
    />
  )
}
