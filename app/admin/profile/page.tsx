import { buildPageMetadata } from '@/app/seo'
import AdminProfilePageMain from '@/components/superAdmin/profile/AdminProfilePageMain'

export const metadata = buildPageMetadata({
  title: 'Admin Profile',
  description: 'View your admin account profile, role, and access summary.',
  path: '/admin/profile',
  noIndex: true,
})

export default function AdminProfilePage() {
  return <AdminProfilePageMain />
}
