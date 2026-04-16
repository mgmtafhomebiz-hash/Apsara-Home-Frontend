import { buildPageMetadata } from '@/app/seo';
import { getNavbarCategories } from '@/libs/serverStorefront';
import VideoGalleryPageClient from '@/components/media/VideoGalleryPageClient';

export const metadata = buildPageMetadata({ title: 'Video Gallery', description: 'Browse our Video Gallery on AF Home.', path: '/media/video-gallery', noIndex: true });
export const dynamic = 'force-dynamic';

async function Page() {
  const initialCategories = await getNavbarCategories();
  return <VideoGalleryPageClient initialCategories={initialCategories} />
}

export default Page
