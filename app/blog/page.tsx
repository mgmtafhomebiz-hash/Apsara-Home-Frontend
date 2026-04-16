import { buildPageMetadata } from '@/app/seo';
import Blogs from '@/components/Blogs';
import { getNavbarCategories } from '@/libs/serverStorefront';

export const metadata = buildPageMetadata({ title: 'Blog', description: 'Browse the Blog page on AF Home.', path: '/blog' });
export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const initialCategories = await getNavbarCategories();
  return <Blogs initialCategories={initialCategories} />
}
