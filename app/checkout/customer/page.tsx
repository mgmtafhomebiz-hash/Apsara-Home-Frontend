import { buildPageMetadata } from '@/app/seo';
import { redirect } from 'next/navigation';

export const metadata = buildPageMetadata({ title: 'Checkout Customer', description: 'Browse the Checkout Customer page on AF Home.', path: '/checkout/customer', noIndex: true });

const CustomerPage = () => {
  redirect('/synergy-shop/checkout/customer');
}

export default CustomerPage;
