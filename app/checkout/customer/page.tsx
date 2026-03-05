import { buildPageMetadata } from '@/app/seo';
import CustomerCheckoutMain from "@/components/checkout/customer/CustomerCheckoutMain";

export const metadata = buildPageMetadata({ title: 'Checkout Customer', description: 'Browse the Checkout Customer page on AF Home.', path: '/checkout/customer', noIndex: true });

const CustomerPage = () => {
  return (
    <CustomerCheckoutMain />
  )
}

export default CustomerPage;