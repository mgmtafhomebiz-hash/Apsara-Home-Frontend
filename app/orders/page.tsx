import { buildPageMetadata } from '@/app/seo';
import OrdersPageMain from "@/components/orders/OrdersPageMain";

export const metadata = buildPageMetadata({ title: 'Orders', description: 'Browse the Orders page on AF Home.', path: '/orders' });

const OrdersPage = () => {
  return (
    <OrdersPageMain />
  )
}

export default OrdersPage