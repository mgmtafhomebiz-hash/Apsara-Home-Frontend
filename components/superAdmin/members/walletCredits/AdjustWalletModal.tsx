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
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Adjust Wallet</h2>
                <p className="text-xs text-slate-400 mt-0.5">{member.name} Â· {member.email}</p>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Current balances */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wide">Cash Balance</p>
                  <p className="text-sm font-bold text-emerald-700 mt-0.5">
                    â‚±{member.cashBalance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wide">PV Balance</p>
                  <p className="text-sm font-bold text-blue-700 mt-0.5">
                    {member.pvBalance.toLocaleString('en-PH', { minimumFractionDigits: 2 })} PV
                  </p>
                </div>
              </div>

              {/* Wallet type */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Wallet Type</label>
                <div className="flex gap-2">
                  {(['cash', 'pv'] as WalletType[]).map(w => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setWalletType(w)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        walletType === w
                          ? w === 'cash'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                            : 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {w === 'cash' ? 'Cash Wallet' : 'PV Wallet'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Adjust type */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Adjustment Type</label>
                <div className="flex gap-2">
                  {(['credit', 'debit'] as AdjustType[]).map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAdjustType(a)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                        adjustType === a
                          ? a === 'credit'
                            ? 'bg-teal-50 border-teal-300 text-teal-700'
                            : 'bg-rose-50 border-rose-300 text-rose-700'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
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
                    className="w-full pl-8 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 bg-slate-50 text-slate-700 placeholder-slate-400 transition"
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
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 bg-slate-50 text-slate-700 placeholder-slate-400 transition resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:border-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${
                    adjustType === 'credit'
                      ? 'bg-teal-600 hover:bg-teal-700'
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


