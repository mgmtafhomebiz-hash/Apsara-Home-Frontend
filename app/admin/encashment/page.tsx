import EncashmentPageMain from "@/components/superAdmin/encashment/EncashmentPageMain";
import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Admin Encashment', description: 'Browse the Admin Encashment page on AF Home.', path: '/admin/encashment', noIndex: true });

export default function AdminEncashmentPage() {
  return <EncashmentPageMain initialFilter="all" />;
}