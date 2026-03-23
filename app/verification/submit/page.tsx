import { redirect } from 'next/navigation';

export default function VerificationSubmitPage() {
  redirect('/profile?tab=encashment&focus=verification#verification-form');
}
