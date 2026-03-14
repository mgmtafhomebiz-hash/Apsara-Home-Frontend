import { buildPageMetadata } from '@/app/seo';
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata = buildPageMetadata({
  title: 'Reset Password',
  description: 'Reset your AF Home account password.',
  path: '/reset-password',
  noIndex: true,
});

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams;
  const token = (params?.token ?? '').trim();

  return <ResetPasswordForm token={token} />;
}
