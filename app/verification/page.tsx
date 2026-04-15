import { redirect } from 'next/navigation';
import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({
  title: 'Verification',
  description: 'Redirecting to the AF Home encashment verification flow.',
  path: '/verification',
  noIndex: true,
});

export default function Page() {
  redirect('/profile?tab=encashment&focus=verification#verification-form');
}
