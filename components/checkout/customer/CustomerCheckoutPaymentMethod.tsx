'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { PaymentMethod } from '@/types/CustomerCheckout/types';

interface Props {
  selectedMethod: PaymentMethod;
  onSelect: (m: PaymentMethod) => void;
  notice: string;
}

const onlineBankingOptions = ['BPI', 'BDO', 'UnionBank', 'Landbank'];
const cardOptions = ['Visa', 'Mastercard'];

const paymentMethods = [
  { id: 'gcash' as PaymentMethod, label: 'GCash', note: 'Pay via GCash wallet', badge: 'Popular', badgeColor: 'bg-blue-500', iconBg: 'bg-gradient-to-br from-blue-400 to-blue-700', icon: <span className="text-white font-black text-lg">G</span> },
  { id: 'maya' as PaymentMethod, label: 'Maya', note: 'Pay via Maya wallet', badge: 'Fast', badgeColor: 'bg-emerald-500', iconBg: 'bg-gradient-to-br from-emerald-400 to-green-700', icon: <span className="text-white font-black text-lg">M</span> },
  { id: 'online_banking' as PaymentMethod, label: 'Online Banking', note: 'Instapay / PesoNet', badge: 'Bank Transfer', badgeColor: 'bg-sky-500', iconBg: 'bg-gradient-to-br from-sky-400 to-blue-600',
    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/></svg> },
  { id: 'card' as PaymentMethod, label: 'Credit / Debit Card', note: 'Visa or Mastercard', badge: '3DS Secured', badgeColor: 'bg-slate-700', iconBg: 'bg-gradient-to-br from-slate-600 to-slate-900',
    icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg> },
];

export default function CustomerCheckoutPaymentMethod({ selectedMethod, onSelect, notice }: Props) {
  const [selectedBank, setSelectedBank] = useState(onlineBankingOptions[0]);
  const [selectedCard, setSelectedCard] = useState(cardOptions[0]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2.5">
        <div className="h-6 w-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0">3</div>
        Payment Method
      </h2>

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
              <div className={`${method.iconBg} h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-md`}>
                {method.icon}
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
              <p className="text-xs font-bold text-sky-700 mb-2.5">Choose your bank</p>
              <div className="grid grid-cols-2 gap-2">
                {onlineBankingOptions.map(bank => (
                  <button key={bank} onClick={() => setSelectedBank(bank)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                      selectedBank === bank ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-sky-700 border-sky-200 hover:border-sky-400'
                    }`}>{bank}</button>
                ))}
              </div>
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
                    className={`flex-1 py-3 rounded-xl text-xs font-bold border-2 transition-all ${
                      selectedCard === card ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                    }`}>{card === 'Visa' ? '💳 Visa' : '💳 Mastercard'}</button>
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
