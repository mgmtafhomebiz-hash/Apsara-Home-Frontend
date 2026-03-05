import { redirect } from "next/navigation";
import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Super_admin', description: 'Browse the Super_admin page on AF Home.', path: '/super_admin', noIndex: true });

export default function LegacySuperAdminDashboardPage() {
  redirect("/admin/dashboard");
}