'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MOCK_WALLETS, MemberWallet, SortKey } from './types'
import WalletCreditsStats from './WalletCreditsStats'
import WalletCreditsToolbar from './WalletCreditsToolbar'
import WalletCreditsTable from './WalletCreditsTable'
import AdjustWalletModal from './AdjustWalletModal'

export default function WalletCreditsPageMain() {
  const [search,        setSearch]        = useState('')
  const [tierFilter,    setTierFilter]    = useState('All Tiers')
  const [statusFilter,  setStatusFilter]  = useState('All Status')
  const [sortKey,       setSortKey]       = useState<SortKey>('cashBalance')
  const [adjustTarget,  setAdjustTarget]  = useState<MemberWallet | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = [...MOCK_WALLETS]

    if (q) {
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
      )
    }
    if (tierFilter !== 'All Tiers') {
      list = list.filter(m => m.tier === tierFilter)
    }
    if (statusFilter !== 'All Status') {
      list = list.filter(m => m.status.toLowerCase() === statusFilter.toLowerCase())
    }

    list.sort((a, b) => b[sortKey] - a[sortKey])
    return list
  }, [search, tierFilter, statusFilter, sortKey])

  const handleAdjustSubmit = (
    memberId:   number,
    walletType: 'cash' | 'pv',
    adjustType: 'credit' | 'debit',
    amount:     number,
    note:       string
  ) => {
    // TODO: call API — PATCH /api/admin/wallets/:memberId/adjust
    console.log('Adjust wallet:', { memberId, walletType, adjustType, amount, note })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-xl font-bold text-slate-800">Wallet & Credits</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage member cash and PV wallet balances</p>
        </div>
        <button className="flex items-center gap-2 rounded-[18px] border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-400 dark:border-white/18 dark:bg-white/12 dark:text-slate-200">
          <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </motion.div>

      <WalletCreditsStats />

      <WalletCreditsToolbar
        search={search}             onSearch={setSearch}
        tierFilter={tierFilter}     onTierFilter={setTierFilter}
        statusFilter={statusFilter} onStatusFilter={setStatusFilter}
        sortKey={sortKey}           onSortKey={setSortKey}
      />

      <WalletCreditsTable
        wallets={filtered}
        sortKey={sortKey}
        onAdjust={setAdjustTarget}
      />

      <AdjustWalletModal
        member={adjustTarget}
        onClose={() => setAdjustTarget(null)}
        onSubmit={handleAdjustSubmit}
      />
    </div>
  )
}
