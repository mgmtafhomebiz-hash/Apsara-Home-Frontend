import { buildPageMetadata } from '@/app/seo';
import ProfilePage from "@/components/profile/ProfilePage";

export const metadata = buildPageMetadata({ title: 'Profile', description: 'Browse the Profile page on AF Home.', path: '/profile', noIndex: true });

export default function Page() {
  return <ProfilePage />
}