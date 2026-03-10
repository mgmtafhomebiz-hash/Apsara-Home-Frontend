'use client'

import { Member } from "@/types/members/types"
import { motion, AnimatePresence } from "framer-motion"
import MembersStatusBadge from "./MembersStatusBadge"
import TierBadge from "@/components/ui/TierBadge"
import { useState } from "react"
import AdminPagination from '@/components/superAdmin/AdminPagination'

const avatarColors = [
  'bg-teal-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500',
  'bg-orange-500', 'bg-green-500', 'bg-indigo-500', 'bg-rose-500',
]
const getAvatarColor = (name: string) => avatarColors[name.charCodeAt(0) % avatarColors.length]
const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
      when: 'beforeChildren',
      staggerChildren: 0.02,
    },
  },
  exit: { opacity: 0, transition: { duration: 0.14 } },
}

const rowVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.16 } },
}

interface MembersTableProps {
  rows: Member[]
  currentPage: number
  totalPages: number
  totalRecords: number
  from: number | null
  to: number | null
  onPageChange: (page: number) => void
}

const MembersTable = ({
  rows,
  currentPage,
  totalPages,
  totalRecords,
  from,
  to,
  onPageChange,
}: MembersTableProps) => {
  const canGoPrev = currentPage > 1
  const canGoNext = currentPage < totalPages
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  const verificationBadge = (member: Member) => {
    const status = member.verificationStatus ?? 'not_verified'
    if (status === 'verified') {
      return <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Verified</span>
    }
    if (status === 'pending_review') {
      return <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">Pending Review</span>
    }
    if (status === 'blocked') {
      return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">Blocked</span>
    }
    return <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">Not Verified</span>
  }

  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-16 gap-3">
        <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <p className="text-slate-600 font-semibold text-sm">No members found</p>
        <p className="text-slate-400 text-xs">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Member</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Tier</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Orders</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Total Spent</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Earnings</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Wallet Credits</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Referrals</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Joined</th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <AnimatePresence mode="wait" initial={false}>
            <motion.tbody
              key={`members-page-${currentPage}`}
              className="divide-y divide-slate-50"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {rows.map((member) => {
                return (
                  <motion.tr
                    key={member.id}
                    variants={rowVariants}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  >
                    {/* Member */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`${getAvatarColor(member.name)} h-9 w-9 rounded-full flex items-center justify-center shrink-0 shadow-sm`}>
                          <span className="text-white font-bold text-xs">{getInitials(member.name)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 text-sm truncate">{member.name}</p>
                          <p className="text-xs text-slate-400 truncate">{member.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <MembersStatusBadge status={member.status} />
                    </td>

                    {/* Tier */}
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <TierBadge tier={member.tier} />
                    </td>

                    {/* Orders */}
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-slate-700 font-medium">{member.orders}</span>
                    </td>

                    {/* Total Spent */}
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-slate-800 font-semibold">₱ {member.totalSpent.toLocaleString()}</span>
                    </td>

                    {/* Earnings */}
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="text-teal-700 font-semibold">₱ {member.earnings.toLocaleString()}</span>
                    </td>

                    {/* Wallet Credits */}
                    <td className="px-5 py-3.5 hidden xl:table-cell">
                      <div className="flex flex-col leading-tight">
                        <span className="text-[11px] font-semibold text-emerald-700">
                          Cash +{Number(member.walletCashCredits ?? 0).toLocaleString()}
                        </span>
                        <span className="text-[11px] font-semibold text-indigo-700">
                          PV +{Number(member.walletPvCredits ?? 0).toLocaleString()}
                        </span>
                      </div>
                    </td>

                    {/* Referrals */}
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-700 font-medium">{member.referrals}</span>
                        {member.referrals > 10 && (
                          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                        )}
                      </div>
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-3.5 hidden xl:table-cell">
                      <span className="text-slate-400 text-xs">{member.joinedAt}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="View"
                          onClick={() => setSelectedMember(member)}
                          className="h-7 w-7 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors flex items-center justify-center"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                          </svg>
                        </button>
                        <button title="Edit" className="h-7 w-7 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        <button title="More options" className="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </motion.tbody>
          </AnimatePresence>
        </table>
      </div>

      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        from={from}
        to={to}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
      />

      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-sm p-4"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="mx-auto mt-10 w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">Member Details</p>
                  <h3 className="mt-1 text-xl font-bold text-slate-900">{selectedMember.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>

              <div className="mb-5 flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                {selectedMember.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedMember.avatar}
                    alt={selectedMember.name}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-white shadow"
                  />
                ) : (
                  <div className={`${getAvatarColor(selectedMember.name)} h-16 w-16 rounded-full flex items-center justify-center shrink-0 shadow-sm`}>
                    <span className="text-white font-bold text-lg">{getInitials(selectedMember.name)}</span>
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-900">{selectedMember.email}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <MembersStatusBadge status={selectedMember.status} />
                    {verificationBadge(selectedMember)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-slate-100 p-3">
                  <p className="text-xs text-slate-500">Tier</p>
                  <div className="mt-1"><TierBadge tier={selectedMember.tier} /></div>
                </div>
                <div className="rounded-xl border border-slate-100 p-3">
                  <p className="text-xs text-slate-500">Orders</p>
                  <p className="mt-1 font-semibold text-slate-800">{selectedMember.orders}</p>
                </div>
                <div className="rounded-xl border border-slate-100 p-3">
                  <p className="text-xs text-slate-500">Total Spent</p>
                  <p className="mt-1 font-semibold text-slate-800">PHP {selectedMember.totalSpent.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-slate-100 p-3">
                  <p className="text-xs text-slate-500">Earnings</p>
                  <p className="mt-1 font-semibold text-teal-700">PHP {selectedMember.earnings.toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-slate-100 p-3">
                  <p className="text-xs text-slate-500">Wallet Cash Credits</p>
                  <p className="mt-1 font-semibold text-emerald-700">+{Number(selectedMember.walletCashCredits ?? 0).toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-slate-100 p-3">
                  <p className="text-xs text-slate-500">Wallet PV Credits</p>
                  <p className="mt-1 font-semibold text-indigo-700">+{Number(selectedMember.walletPvCredits ?? 0).toLocaleString()}</p>
                </div>
                <div className="rounded-xl border border-slate-100 p-3">
                  <p className="text-xs text-slate-500">Referrals</p>
                  <p className="mt-1 font-semibold text-slate-800">{selectedMember.referrals}</p>
                </div>
                <div className="rounded-xl border border-slate-100 p-3">
                  <p className="text-xs text-slate-500">Joined</p>
                  <p className="mt-1 font-semibold text-slate-800">{selectedMember.joinedAt}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MembersTable
