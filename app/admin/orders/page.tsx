import AdminOrdersPageMain from "@/components/superAdmin/orders/AdminOrdersPageMain";
import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Admin Orders', description: 'Browse the Admin Orders page on AF Home.', path: '/admin/orders', noIndex: true });

export default function AdminOrdersPage() {
  return <AdminOrdersPageMain initialFilter="all" />;
}