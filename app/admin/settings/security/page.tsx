import { buildPageMetadata } from '@/app/seo'
import UnderMaintenancePage from '@/components/superAdmin/UnderMaintenancePage'

export const metadata = buildPageMetadata({
  title: 'Admin Settings Security',
  description: 'Browse the Admin Settings Security page on AF Home.',
  path: '/admin/settings/security',
  noIndex: true,
})

export default function AdminSettingsSecurityPage() {
  return (
    <UnderMaintenancePage
      title="Security Settings"
      description="Security controls and audit preferences are still being built."
    />
  )
}
