import { buildPageMetadata } from '@/app/seo'
import UnderMaintenancePage from '@/components/superAdmin/UnderMaintenancePage'

export const metadata = buildPageMetadata({
  title: 'Admin Settings Notifications',
  description: 'Browse the Admin Settings Notifications page on AF Home.',
  path: '/admin/settings/notifications',
  noIndex: true,
})

export default function AdminSettingsNotificationsPage() {
  return (
    <UnderMaintenancePage
      title="Notification Settings"
      description="Admin notification preferences are still under construction."
    />
  )
}
