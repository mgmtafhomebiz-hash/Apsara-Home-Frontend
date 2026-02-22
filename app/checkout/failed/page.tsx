'use client';

import Link from 'next/link';

export default function CheckoutFailedPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-900">Payment Cancelled</h1>
        <p className="mt-3 text-sm text-gray-600">
          The payment was not completed. You can retry the checkout flow anytime.
        </p>
        <div className="mt-6 flex gap-2">
          <Link href="/" className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
            Back to Home
          </Link>
          <Link href="/checkout" className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-gray-50">
            Retry Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}
