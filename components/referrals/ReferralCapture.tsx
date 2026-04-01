'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { setStoredReferralCode } from '@/libs/referral';

const ReferralCapture = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  useEffect(() => {
    const referralCode = (searchParams.get('ref') ?? searchParams.get('referred_by') ?? '').trim();
    if (!referralCode) return;

    const role = String(session?.user?.role ?? '').toLowerCase();
    const isCustomerSession = status === 'authenticated' && (role === 'customer' || role === '');

    if (!isCustomerSession) {
      setStoredReferralCode(referralCode);
    }
  }, [pathname, searchParams, session?.user?.role, status]);

  return null;
};

export default ReferralCapture;
