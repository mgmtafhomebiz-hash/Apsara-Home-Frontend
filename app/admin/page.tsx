import { redirect } from "next/navigation";
import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Admin', description: 'Browse the Admin page on AF Home.', path: '/admin', noIndex: true });

export default function AdminIndexPage() {
  redirect("/admin/dashboard");
}