import MembersPageMain from "@/components/superAdmin/members/MembersPageMain";
import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Admin Members', description: 'Browse the Admin Members page on AF Home.', path: '/admin/members', noIndex: true });

export default function AdminMembersPage() {
  return <MembersPageMain />;
}