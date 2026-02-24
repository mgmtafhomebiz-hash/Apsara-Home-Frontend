'use client';

import { CategoryProduct } from '@/libs/CategoryData';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useMemo, useState, useEffect } from 'react';
import Loading from '../Loading';

interface BuyNowOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CategoryProduct;
  quantity?: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedType?: string;
}

type PaymentMethod = 'online_banking' | 'card' | 'gcash' | 'maya';
const onlineBankingOptions = ['BPI', 'BDO', 'UnionBank', 'Landbank'];
const cardOptions = ['Visa', 'Mastercard'];

const paymentMethods: Array<{
  id: PaymentMethod;
  label: string;
  note: string;
  badge: string;
}> = [
    { id: 'online_banking', label: 'Online Banking', note: 'Bank app or web banking', badge: 'Instapay / Pesonet' },
    { id: 'card', label: 'Cards', note: 'Visa or Mastercard', badge: '3DS secured' },
    { id: 'gcash', label: 'GCash', note: 'Pay via GCash wallet', badge: 'Popular' },
    { id: 'maya', label: 'Maya', note: 'Pay via Maya wallet', badge: 'Fast checkout' },
  ];

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const methodLabelMap: Record<PaymentMethod, string> = {
  online_banking: 'Online Banking',
  card: 'Cards',
  gcash: 'GCash',
  maya: 'Maya',
};

const paymentBrand: Record<PaymentMethod, string> = {
  online_banking: 'from-sky-500 to-blue-600',
  card: 'from-slate-700 to-slate-900',
  gcash: 'from-blue-500 to-blue-700',
  maya: 'from-emerald-500 to-green-700',
};

const BuyNowOptionsModal = ({
  isOpen,
  onClose,
  product,
  quantity = 1,
  selectedColor,
  selectedSize,
  selectedType,
}: BuyNowOptionsModalProps) => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL?.replace(/\/$/, '');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('gcash');
  const [selectedOnlineBank, setSelectedOnlineBank] = useState(onlineBankingOptions[0]);
  const [selectedCardBrand, setSelectedCardBrand] = useState(cardOptions[0]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setNotice('');
  }, [selectedMethod, selectedOnlineBank, selectedCardBrand])


  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(() => product.price * quantity, [product.price, quantity]);
  const handlingFee = subtotal >= 5000 ? 0 : 99;
  const total = subtotal + handlingFee;

  const handleProceed = async () => {
    if (!apiBaseUrl) {
      alert('Missing NEXT_PUBLIC_LARAVEL_API_URL. Please set it in your environment variables.');
      return;
    }

    if (selectedMethod === 'online_banking') {
      setNotice(`Online Banking (${selectedOnlineBank}) is coming soon.`)
      return;
    }

    if (selectedMethod === 'card') {
      setNotice(`${selectedCardBrand}`)
    }
    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/api/payments/checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          description: product.name,
          payment_method: selectedMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkout_url) {
        console.error(data);
        alert('Failed to create checkout session');
        return;
      }

      if (data.checkout_id) {
        localStorage.setItem('last_checkout_id', data.checkout_id);
      }

      window.location.href = data.checkout_url;
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="fixed inset-0 z-[100] p-4 sm:p-6 md:p-10 overflow-y-auto"
          >
            <div
              className="mx-auto w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-gray-100 bg-gray-50">
                <div>
                  <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">Order Summary</p>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">Choose your payment method</h2>
                </div>
                <button
                  className="h-9 w-9 rounded-xl border border-gray-200 text-gray-500 hover:text-slate-900 hover:bg-white transition-colors flex items-center justify-center"
                  onClick={onClose}
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5">
                <div className="lg:col-span-2 p-5 sm:p-7 bg-gradient-to-br from-orange-50 via-white to-slate-50 border-r border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Order Summary</p>
                  <div className="flex gap-3 rounded-2xl bg-white border border-orange-100 p-3 shadow-sm">
                    <div className="relative h-20 w-20 rounded-xl bg-white border border-orange-100 p-3 shadow-sm overflow-hidden">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 leading-tight line-clamp-2">{product.name}</p>
                      <p className="text-orange-500 font-bold text-sm mt-1">PHP {product.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">Qty: {quantity}</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 space-y-2 text-sm">
                    {selectedType && (
                      <div className="flex justify-between text-gray-600">
                        <span>Type</span>
                        <span className="font-semibold text-slate-700">{selectedType}</span>
                      </div>
                    )}
                    {selectedSize && (
                      <div className="flex justify-between text-gray-600">
                        <span>Size</span>
                        <span className="font-semibold text-slate-700">{selectedSize}</span>
                      </div>
                    )}
                    {selectedColor && (
                      <div className="flex justify-between text-gray-600">
                        <span>Color</span>
                        <span className="font-semibold text-slate-700">{selectedColor}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-700">PHP {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Handling fee</span>
                      <span>{handlingFee ? `PHP ${handlingFee}` : 'Free'}</span>
                    </div>
                    <div className="h-px bg-gray-100" />
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-700">Total</span>
                      <span className="font-bold text-orange-500">PHP {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-3 p-5 sm:p-7">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Payment Options</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {paymentMethods.map((method) => {
                      const selected = selectedMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedMethod(method.id)}
                          className={`text-left rounded-2xl border p-4 transition-all ${selected
                            ? 'border-orange-300 ring-2 ring-orange-200 bg-orange-50/50'
                            : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/30'
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-800">{method.label}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold text-white bg-gradient-to-r ${paymentBrand[method.id]}`}>
                              {method.badge}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{method.note}</p>
                          {selected && (
                            <span className="mt-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white">
                              <CheckIcon />
                            </span>
                          )}
                        </button>
                      );
                    })}

                    {selectedMethod === 'online_banking' && (
                      <div className='mt-3 rounded-2xl border border-sky-100 bg-sky-50 p-3'>
                        <p className='text-xs  font-semibold text-sky-700 mb-2'>Choose bank</p>
                        <div className='flex flex-wrap gap-2'>
                          {onlineBankingOptions.map((bank) => (
                            <button
                              key={bank}
                              type='button'
                              onClick={() => setSelectedOnlineBank(bank)}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selectedOnlineBank === bank
                                ? 'bg-sky-600 text-white border-sky-600'
                                : 'bg-white text-sky-700 border-sky-200 hover:border-sky-300'
                                }`}
                            >
                              {bank}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedMethod === 'card' && (
                      <div className='mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3'>
                        <p className='text-xs font-semibold text-slate-700 mb-2'>Choose card type</p>
                        <div className='flex flex-wrap gap-2'>
                          {cardOptions.map((brand) => (
                            <button
                              key={brand}
                              type='button'
                              onClick={() => setSelectedCardBrand(brand)}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selectedCardBrand === brand
                                ? 'bg-slate-800 text-white border-slate-800'
                                : 'bg-white text-slate-300 hover:border-slate-400'
                                }`}
                            >
                              {brand}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-sm font-semibold text-slate-700">What happens next?</p>
                    <ul className="mt-2 text-xs text-gray-600 space-y-1.5">
                      <li>1. You will proceed with: <span className="font-semibold text-slate-700">{methodLabelMap[selectedMethod]}</span></li>
                      <li>2. Checkout screen will show a payment summary and test confirmation.</li>
                      <li>3. When backend is ready, this step can create a PayMongo checkout session.</li>
                    </ul>
                  </div>

                  {notice && (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      {notice}
                    </div>
                  )}

                  <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                    <button
                      onClick={onClose}
                      className="sm:flex-1 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleProceed}
                      disabled={loading}
                      className="sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-3 text-sm font-semibold transition-colors shadow-lg shadow-orange-100"
                    >
                      {loading ?
                        <>
                          <Loading size={16} />
                          <span>Proceed to checkout</span>
                        </>
                        : 'Continue to Checkout'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BuyNowOptionsModal;
