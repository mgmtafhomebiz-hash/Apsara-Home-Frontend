'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type VerifyResponse = {
  checkout_id: string;
  status: string | null;
  payment_intent_id: string | null;
};

 function CheckoutSuccessPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL?.replace(/\/$/, '');
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      const checkoutId = localStorage.getItem('last_checkout_id');

      if (!checkoutId) {
        if (!isMounted) return;
        setError('No checkout reference found in local storage.');
        setLoading(false);
        return;
      }

      if (!apiBaseUrl) {
        if (!isMounted) return;
        setError('Missing NEXT_PUBLIC_LARAVEL_API_URL environment variable.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${apiBaseUrl}/api/payments/checkout-session/${checkoutId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Verification failed');
        if (!isMounted) return;
        setResult(data);
      } catch (e) {
        if (!isMounted) return;
        setError(e instanceof Error ? e.message : 'Verification failed');
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    verify();
    return () => {
      isMounted = false;
    };
  }, [apiBaseUrl]);

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-900">Payment Result</h1>

        {loading && <p className="mt-3 text-sm text-gray-500">Verifying payment...</p>}

        {!loading && error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && result && (
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <p><span className="font-semibold">Checkout ID:</span> {result.checkout_id}</p>
            <p><span className="font-semibold">Status:</span> {result.status ?? 'unknown'}</p>
            <p><span className="font-semibold">Payment Intent:</span> {result.payment_intent_id ?? 'n/a'}</p>
          </div>
        )}

        <div className="mt-6">
          <Link href="/" className="inline-block rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default CheckoutSuccessPage;
