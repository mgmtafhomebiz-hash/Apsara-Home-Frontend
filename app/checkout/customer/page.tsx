import { buildPageMetadata } from '@/app/seo';
import CustomerCheckoutMain from '@/components/checkout/customer/CustomerCheckoutMain';
import { getNavbarCategories } from '@/libs/serverStorefront';

export const dynamic = 'force-dynamic';

export const metadata = buildPageMetadata({
  title: 'Checkout Customer',
  description: 'Browse the Checkout Customer page on AF Home.',
  path: '/checkout/customer',
  noIndex: true,
});

export default async function CustomerPage() {
  const navbarCategories = await getNavbarCategories();

  return <CustomerCheckoutMain initialCategories={navbarCategories} />;
}
