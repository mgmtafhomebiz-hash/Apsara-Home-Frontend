import LandingPage from "@/components/landing-page/LandingPage";
import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Landing Page', description: 'Browse the Landing Page page on AF Home.', path: '/landing-page' });

export default function LandingPageRoute() {
  return <LandingPage />;
}