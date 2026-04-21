'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MemberWallet, AdjustType, WalletType } from './types'

interface AdjustWalletModalProps {
  member:   MemberWallet | null
  onClose:  () => void
  onSubmit: (memberId: number, type: WalletType, adjust: AdjustType, amount: number, note: string) => void
}

export default function AdjustWalletModal({ member, onClose, onSubmit }: AdjustWalletModalProps) {
  const [walletType,  setWalletType]  = useState<WalletType>('cash')
  const [adjustType,  setAdjustType]  = useState<AdjustType>('credit')
  const [amount,      setAmount]      = useState('')
  const [note,        setNote]        = useState('')

  if (!member) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseFloat(amount)
    if (!val || val <= 0) return
    onSubmit(member.id, walletType, adjustType, val, note)
    onClose()
  }

  return (
    <AnimatePresence>
      {member && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white z-10 dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Adjust Wallet</h2>
                <p className="text-xs text-slate-400 mt-0.5">{member.name} Â· {member.email}</p>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Current balances */}
              <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5">
                  <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wide">Cash Balance</p>
                  <p className="text-sm font-bold text-emerald-700 mt-0.5">
                    â‚±{member.cashBalance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                  <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5">
                  <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wide">PV Balance</p>
                  <p className="text-sm font-bold text-blue-700 mt-0.5">
                    {member.pvBalance.toLocaleString('en-PH', { minimumFractionDigits: 2 })} PV
                  </p>
                </div>
              </div>

              {/* Wallet type */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Wallet Type</label>
                <div className="flex gap-2">
                  {(['cash', 'pv'] as WalletType[]).map(w => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWalletType(w)}
                      className={`flex-1 rounded-[18px] border px-4 py-2 text-sm font-semibold transition-all ${
                        walletType === w
                          ? w === 'cash'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-sky-200 bg-sky-50 text-sky-700'
                          : 'border-gray-300 text-slate-500 hover:border-slate-400 dark:border-white/18 dark:text-slate-300'
                      }`}
                    >
                      {w === 'cash' ? 'Cash Wallet' : 'PV Wallet'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Adjust type */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Adjustment Type</label>
                <div className="flex gap-2">
                  {(['credit', 'debit'] as AdjustType[]).map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAdjustType(a)}
                      className={`flex-1 rounded-[18px] border px-4 py-2 text-sm font-semibold transition-all ${
                        adjustType === a
                          ? a === 'credit'
                            ? 'border-sky-200 bg-sky-50 text-sky-700'
                            : 'border-rose-200 bg-rose-50 text-rose-700'
                          : 'border-gray-300 text-slate-500 hover:border-slate-400 dark:border-white/18 dark:text-slate-300'
                      }`}
                    >
                      {a === 'credit' ? '+ Credit' : '- Debit'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
                  Amount {walletType === 'cash' ? '(PHP)' : '(PV)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">
                    {walletType === 'cash' ? 'â‚±' : 'PV'}
                  </span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                    className="h-11 w-full rounded-[18px] border border-gray-300 bg-white pl-8 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-sky-400 focus:bg-white dark:border-white/18 dark:bg-white/12 dark:text-white dark:placeholder:text-white/55 dark:focus:border-sky-400/60 dark:focus:bg-white/18"
                  />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Note / Reason</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Manual adjustment for bonus payoutâ€¦"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full rounded-[18px] border border-gray-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-sky-400 focus:bg-white dark:border-white/18 dark:bg-white/12 dark:text-white dark:placeholder:text-white/55 dark:focus:border-sky-400/60 dark:focus:bg-white/18 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-[18px] border border-gray-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-400 dark:border-white/18 dark:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 rounded-[18px] px-4 py-2.5 text-sm font-bold text-white transition-all ${
                    adjustType === 'credit'
                      ? 'bg-sky-500 hover:bg-sky-600'
                      : 'bg-rose-500 hover:bg-rose-600'
                  }`}
                >
                  {adjustType === 'credit' ? 'Apply Credit' : 'Apply Debit'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}


