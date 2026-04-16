import { buildPageMetadata } from '@/app/seo';
import OrdersPageMain from "@/components/orders/OrdersPageMain";
import { getNavbarCategories } from '@/libs/serverStorefront';

export const metadata = buildPageMetadata({ title: 'Orders', description: 'Browse the Orders page on AF Home.', path: '/orders', noIndex: true });
export const dynamic = 'force-dynamic';

async function Page() {
  const initialCategories = await getNavbarCategories();
  return <OrdersPageMain initialCategories={initialCategories} />
}

export default Page