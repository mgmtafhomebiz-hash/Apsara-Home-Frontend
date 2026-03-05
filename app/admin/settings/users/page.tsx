import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Admin Settings Users', description: 'Browse the Admin Settings Users page on AF Home.', path: '/admin/settings/users', noIndex: true });

import AdminUsersPageMain from '@/components/superAdmin/settings/AdminUsersPageMain'

export default function AdminUsersSettingsPage() {
  return <AdminUsersPageMain />
}