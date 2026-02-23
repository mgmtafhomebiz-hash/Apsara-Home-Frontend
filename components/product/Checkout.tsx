'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const methodMap: Record<string, string> = {
  online_banking: 'Online Banking',
  card: 'Cards',
  gcash: 'GCash',
  maya: 'Maya',
};

const Checkout = () => {
  const params = useSearchParams();

  const item = params.get('item') ?? 'Product';
  const qty = Number(params.get('qty') ?? '1');
  const total = Number(params.get('total') ?? '0');
  const method = params.get('method') ?? 'gcash';

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold text-orange-500 uppercase">Test Checkout</p>
          <h1 className="text-xl font-bold text-slate-900 mt-1">{item}</h1>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Qty</span><span>{qty}</span></div>
            <div className="flex justify-between"><span>Method</span><span>{methodMap[method] ?? method}</span></div>
            <div className="flex justify-between font-bold text-orange-500"><span>Total</span><span>PHP {total.toLocaleString()}</span></div>
          </div>

          <p className="mt-4 text-xs text-gray-500">This is a test-only checkout summary before redirecting to PayMongo.</p>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-5">
          <p className="text-sm font-semibold">Testing Mode</p>
          <p className="text-xs text-slate-300 mt-2">
            No webhook yet. Do not mark as paid automatically in production.
          </p>
          <Link href="/" className="inline-block mt-4 text-sm text-orange-300 hover:text-orange-200">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
