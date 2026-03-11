import { buildPageMetadata } from '@/app/seo'
import UnderMaintenancePage from '@/components/superAdmin/UnderMaintenancePage'

export const metadata = buildPageMetadata({
  title: 'Admin Project',
  description: 'Browse the Admin Project page on AF Home.',
  path: '/admin/project',
  noIndex: true,
})

export default function AdminProjectPage() {
  return (
    <UnderMaintenancePage
      title="Project"
      description="Project workspace tools are still being developed."
    />
  )
}
