import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Wishlist', description: 'Browse the Wishlist page on AF Home.', path: '/wishlist' });

import Wishlist from "@/components/Wishlist"

const WishlistPage = () => {
  return <Wishlist />
}

export default WishlistPage