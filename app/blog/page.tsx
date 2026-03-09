import { buildPageMetadata } from '@/app/seo';
import Blogs from '@/components/Blogs';

export const metadata = buildPageMetadata({ title: 'Blog', description: 'Browse the Blog page on AF Home.', path: '/blog' });

export default function BlogPage() {
  return <Blogs />
}
