import { redirect } from 'next/navigation';

export default function VerificationStatusPage() {
  redirect('/profile?tab=encashment');
}
