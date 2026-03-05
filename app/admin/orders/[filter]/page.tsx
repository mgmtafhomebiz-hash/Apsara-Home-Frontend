import AdminOrdersPageMain from "@/components/superAdmin/orders/AdminOrdersPageMain";
import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Admin Orders Details', description: 'Browse the Admin Orders Details page on AF Home.', path: '/admin/orders/[filter]', noIndex: true });

interface PageProps {
  params: Promise<{ filter: string }>;
}

export default async function AdminOrdersFilterPage({ params }: PageProps) {
  const { filter } = await params;
  return <AdminOrdersPageMain initialFilter={filter} />;
}