'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { PaymentMethod, PaymentMode } from '@/types/CustomerCheckout/types';
import { CheckoutOnlineBankingProvider } from '@/store/api/paymentApi';

interface Props {
  selectedMethod: PaymentMethod;
  onSelect: (m: PaymentMethod) => void;
  notice: string;
  paymentMode: PaymentMode;
  paymentModeOptions: PaymentMode[];
  onPaymentModeChange: (mode: PaymentMode) => void;
  selectedOnlineBankingProvider: CheckoutOnlineBankingProvider;
  onOnlineBankingProviderChange: (provider: CheckoutOnlineBankingProvider) => void;
  showOnlineBankingProviderPicker: boolean;
}

const onlineBankingOptions: Array<{ id: CheckoutOnlineBankingProvider; label: string; description: string }> = [
  { id: 'dob', label: 'BDO', description: 'Direct Online Banking via PayMongo' },
  { id: 'ubp', label: 'UnionBank', description: 'Direct Online Banking via PayMongo' },
];
const cardOptions = ['Visa', 'Mastercard'];

const paymentMethods = [
  { id: 'gcash' as PaymentMethod, label: 'GCash', note: 'Pay via GCash wallet', badge: 'Popular', badgeColor: 'bg-blue-500', logos: ['/payment-logos/gcash.svg'] },
  { id: 'maya' as PaymentMethod, label: 'Maya', note: 'Pay via Maya wallet', badge: 'Fast', badgeColor: 'bg-emerald-500', logos: ['/payment-logos/maya.svg'] },
  { id: 'online_banking' as PaymentMethod, label: 'Online Banking', note: 'Instapay / PesoNet', badge: 'Bank Transfer', badgeColor: 'bg-sky-500', logos: ['/payment-logos/online-banking.svg'] },
  { id: 'card' as PaymentMethod, label: 'Credit / Debit Card', note: 'Visa or Mastercard', badge: '3DS Secured', badgeColor: 'bg-slate-700', logos: ['/payment-logos/visa.svg', '/payment-logos/mastercard.svg'] },
];

export default function CustomerCheckoutPaymentMethod({
  selectedMethod,
  onSelect,
  notice,
  paymentMode,
  paymentModeOptions,
  onPaymentModeChange,
  selectedOnlineBankingProvider,
  onOnlineBankingProviderChange,
  showOnlineBankingProviderPicker,
}: Props) {
  const [selectedCard, setSelectedCard] = useState(cardOptions[0]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2.5">
        <div className="h-6 w-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0">3</div>
        Payment Method
      </h2>

      {paymentModeOptions.length > 1 && (
        <div className="mb-4 rounded-2xl border border-orange-200 bg-orange-50/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Payment Mode</p>
              <p className="mt-1 text-xs text-slate-500">Local-only switch for testing PayMongo test and live credentials.</p>
            </div>
            <div className="inline-flex rounded-2xl border border-orange-200 bg-white p-1 shadow-sm">
              {paymentModeOptions.map((mode) => {
                const selected = paymentMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onPaymentModeChange(mode)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition ${
                      selected
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-orange-50 hover:text-orange-700'
                    }`}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Method cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {paymentMethods.map(method => {
          const selected = selectedMethod === method.id;
          return (
            <button
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`text-left rounded-2xl border-2 p-4 transition-all flex items-center gap-3 ${
                selected ? 'border-orange-400 bg-orange-50/70 shadow-sm' : 'border-slate-100 hover:border-orange-200 bg-white'
              }`}
            >
              <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm p-1.5 overflow-hidden">
                {method.logos.length === 1 ? (
                  <div className="relative w-full h-full">
                    <Image src={method.logos[0]} alt={method.label} fill className="object-contain" />
                  </div>
                ) : (
                  <div className="flex gap-0.5 w-full h-full items-center justify-center">
                    {method.logos.map(logo => (
                      <div key={logo} className="relative w-4 h-3.5 shrink-0">
                        <Image src={logo} alt="" fill className="object-contain" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm font-bold text-slate-800">{method.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold text-white ${method.badgeColor}`}>{method.badge}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{method.note}</p>
              </div>
              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                selected ? 'border-orange-500 bg-orange-500' : 'border-slate-300'
              }`}>
                {selected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-2 w-2 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bank sub-selector */}
      <AnimatePresence>
        {selectedMethod === 'online_banking' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="mt-3 p-4 rounded-2xl border border-sky-100 bg-sky-50/60">
              {showOnlineBankingProviderPicker ? (
                <>
                  <p className="text-xs font-bold text-sky-700 mb-2.5">Choose your bank</p>
                  <p className="mb-3 text-[11px] text-sky-700/80">Local test mode lets you pin the exact provider before redirecting to PayMongo.</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {onlineBankingOptions.map(bank => (
                      <button key={bank.id} type="button" onClick={() => onOnlineBankingProviderChange(bank.id)}
                        className={`rounded-xl border-2 px-3 py-3 text-left transition-all ${
                          selectedOnlineBankingProvider === bank.id ? 'border-sky-600 bg-sky-600 text-white' : 'border-sky-200 bg-white text-sky-700 hover:border-sky-400'
                        }`}>
                        <p className="text-xs font-bold">{bank.label}</p>
                        <p className={`mt-1 text-[11px] ${selectedOnlineBankingProvider === bank.id ? 'text-sky-100' : 'text-sky-700/70'}`}>{bank.description}</p>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs font-bold text-sky-700">Bank selection will continue on the PayMongo payment page.</p>
                  <p className="mt-2 text-[11px] text-sky-700/80">Live mode sends the enabled online banking options directly to PayMongo, so the final bank UI will appear after redirect.</p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card sub-selector */}
      <AnimatePresence>
        {selectedMethod === 'card' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="mt-3 p-4 rounded-2xl border border-slate-200 bg-slate-50/60">
              <p className="text-xs font-bold text-slate-700 mb-2.5">Select card type</p>
              <div className="flex gap-2">
                {cardOptions.map(card => (
                  <button key={card} onClick={() => setSelectedCard(card)}
                    className={`flex-1 py-2.5 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                      selectedCard === card ? 'border-slate-800 bg-slate-50 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <div className="relative w-10 h-6 shrink-0">
                      <Image src={`/payment-logos/${card.toLowerCase()}.svg`} alt={card} fill className="object-contain" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">{card}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notice */}
      <AnimatePresence>
        {notice && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <p className="text-xs text-amber-800 font-medium">{notice}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
