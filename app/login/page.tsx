import { buildPageMetadata } from '@/app/seo';
import LoginPageClient from "@/components/auth/LoginPageClient";

export const metadata = buildPageMetadata({ title: 'Login', description: 'Browse the Login page on AF Home.', path: '/login' });

export default function LoginPage() {
  return <LoginPageClient />;
}