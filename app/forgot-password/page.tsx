import { buildPageMetadata } from '@/app/seo';
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata = buildPageMetadata({
  title: 'Forgot Password',
  description: 'Request a password reset for your AF Home account.',
  path: '/forgot-password',
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
