import { buildPageMetadata } from '@/app/seo';
import VerificationOverviewPage from '@/components/verification/VerificationOverviewPage';

export const metadata = buildPageMetadata({
  title: 'Verification',
  description: 'Learn about AF Home account verification and continue to the KYC submission flow.',
  path: '/verification',
  noIndex: true,
});

export default function Page() {
  return <VerificationOverviewPage />;
}
