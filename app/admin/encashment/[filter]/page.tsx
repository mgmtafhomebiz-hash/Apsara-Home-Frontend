import EncashmentPageMain from "@/components/superAdmin/encashment/EncashmentPageMain";
import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Admin Encashment Details', description: 'Browse the Admin Encashment Details page on AF Home.', path: '/admin/encashment/[filter]', noIndex: true });

interface PageProps {
  params: Promise<{ filter: string }>;
}

export default async function AdminEncashmentFilterPage({ params }: PageProps) {
  const { filter } = await params;
  return <EncashmentPageMain initialFilter={filter} />;
}