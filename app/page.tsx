import LandingPage from "@/components/landing-page/LandingPage";
import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Page.tsx', description: 'Browse the Page.tsx page on AF Home.', path: '/page.tsx' });

export default function Home() {
  return <LandingPage />;
}