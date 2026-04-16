import { buildPageMetadata } from '@/app/seo';
import { getNavbarCategories } from '@/libs/serverStorefront';

export const metadata = buildPageMetadata({ title: 'Wishlist', description: 'Browse the Wishlist page on AF Home.', path: '/wishlist', noIndex: true });
export const dynamic = 'force-dynamic';

import Wishlist from "@/components/Wishlist"

async function Page() {
  const initialCategories = await getNavbarCategories();
  return <Wishlist initialCategories={initialCategories} />
}

export default Page