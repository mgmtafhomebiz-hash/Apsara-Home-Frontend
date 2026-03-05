import { redirect } from "next/navigation";
import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Super_admin Members', description: 'Browse the Super_admin Members page on AF Home.', path: '/super_admin/members', noIndex: true });

export default function LegacySuperAdminMembersPage() {
  redirect("/admin/members");
}