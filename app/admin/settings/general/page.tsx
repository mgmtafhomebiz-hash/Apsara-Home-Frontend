import { buildPageMetadata } from '@/app/seo'
import UnderMaintenancePage from '@/components/superAdmin/UnderMaintenancePage'

export const metadata = buildPageMetadata({
  title: 'Admin Settings General',
  description: 'Browse the Admin Settings General page on AF Home.',
  path: '/admin/settings/general',
  noIndex: true,
})

export default function AdminSettingsGeneralPage() {
  return (
    <UnderMaintenancePage
      title="General Settings"
      description="General admin configuration is still under maintenance."
    />
  )
}
