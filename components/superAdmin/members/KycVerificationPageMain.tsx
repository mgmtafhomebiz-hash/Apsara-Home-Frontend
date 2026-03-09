'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MemberKycItem,
  MemberKycStatus,
  useApproveMemberKycMutation,
  useGetMembersKycQuery,
  useRejectMemberKycMutation,
} from '@/store/api/membersApi'
import { showErrorToast, showSuccessToast } from '@/libs/toast'

/* ─── helpers ─────────────────────────────────────────────── */

const formatDate = (value?: string | null) => {
  if (!value) return 'N/A'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return 'N/A'
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  }).format(d)
}

const getInitials = (name?: string | null) => {
  if (!name) return '?'
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}

const STATUS_CONFIG: Record<MemberKycStatus, { label: string; dot: string; badge: string; tab: string }> = {
  pending_review: {
    label: 'Pending Review',
    dot:   'bg-amber-400',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    tab:   'bg-amber-50 text-amber-700 border-amber-200',
  },
  approved: {
    label: 'Approved',
    dot:   'bg-emerald-400',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    tab:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  rejected: {
    label: 'Rejected',
    dot:   'bg-red-400',
    badge: 'bg-red-50 text-red-700 border-red-200',
    tab:   'bg-red-50 text-red-700 border-red-200',
  },
  on_hold: {
    label: 'On Hold',
    dot:   'bg-slate-400',
    badge: 'bg-slate-100 text-slate-600 border-slate-300',
    tab:   'bg-slate-100 text-slate-600 border-slate-300',
  },
}

type FilterKey = 'all' | MemberKycStatus
type ActionType = 'approve' | 'reject'

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: 'pending_review', label: 'Pending'  },
  { key: 'approved',       label: 'Approved' },
  { key: 'rejected',       label: 'Rejected' },
  { key: 'on_hold',        label: 'On Hold'  },
  { key: 'all',            label: 'All'      },
]

/* ─── stat card ───────────────────────────────────────────── */

function StatCard({
  label, value, icon, bg, text, border,
}: {
  label: string; value: number; icon: React.ReactNode
  bg: string; text: string; border: string
}) {
  return (
    <div className={`bg-white border ${border} rounded-2xl p-4 shadow-sm`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`h-9 w-9 rounded-xl ${bg} ${text} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <p className="text-[11px] text-slate-400 font-medium leading-tight">{label}</p>
      </div>
      <p className="text-xl font-bold text-slate-800">{value}</p>
    </div>
  )
}

/* ─── document card ───────────────────────────────────────── */

function DocCard({ label, url }: { label: string; url?: string | null }) {
  const hasUrl = !!url
  return (
    <a
      href={hasUrl ? url : undefined}
      target={hasUrl ? '_blank' : undefined}
      rel="noreferrer"
      className={`group flex flex-col items-center justify-center gap-2 rounded-2xl border p-5 transition-all ${
        hasUrl
          ? 'border-teal-100 bg-teal-50/50 hover:bg-teal-50 hover:border-teal-200 cursor-pointer'
          : 'border-slate-100 bg-slate-50 cursor-default opacity-60'
      }`}
    >
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${hasUrl ? 'bg-teal-100 text-teal-600' : 'bg-slate-200 text-slate-400'}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="text-xs font-semibold text-slate-600">{label}</p>
      <span className={`text-[11px] font-medium ${hasUrl ? 'text-teal-600 group-hover:underline' : 'text-slate-400'}`}>
        {hasUrl ? 'View document' : 'Not provided'}
      </span>
    </a>
  )
}

/* ─── detail modal ────────────────────────────────────────── */

function DetailModal({ item, onClose, onAction }: {
  item: MemberKycItem
  onClose: () => void
  onAction: (action: ActionType, id: number) => void
}) {
  const cfg    = STATUS_CONFIG[item.status]
  const name   = item.customer?.name || item.full_name || 'Member'
  const email  = item.customer?.email || 'No email'
  const isPending = item.status === 'pending_review' || item.status === 'on_hold'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl z-10 overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-linear-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {getInitials(name)}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">{name}</h2>
              <p className="text-xs text-slate-400">{item.reference_no} · {email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
            <button
              onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[65vh] overflow-y-auto space-y-5">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'ID Type',        value: item.id_type || 'N/A'              },
              { label: 'ID Number',      value: item.id_number || 'Not provided'   },
              { label: 'Contact',        value: item.contact_number || 'Not provided' },
              { label: 'Birth Date',     value: item.birth_date || 'Not provided'  },
              { label: 'Submitted',      value: formatDate(item.created_at)        },
              { label: 'Reviewed At',    value: formatDate(item.reviewed_at)       },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                <p className="text-sm font-medium text-slate-700 mt-1">{value}</p>
              </div>
            ))}
          </div>

          {/* Address */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Address</p>
            <p className="text-sm text-slate-700">
              {[item.address_line, item.city, item.province, item.postal_code, item.country]
                .filter(Boolean).join(', ') || 'No address provided.'}
            </p>
          </div>

          {/* Notes */}
          {(item.notes || item.review_notes) && (
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3 space-y-1.5">
              {item.notes && (
                <p className="text-sm text-slate-700">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mr-2">Submitted Note:</span>
                  {item.notes}
                </p>
              )}
              {item.review_notes && (
                <p className="text-sm text-slate-700">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mr-2">Review Note:</span>
                  {item.review_notes}
                </p>
              )}
            </div>
          )}

          {/* Documents */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Documents</p>
            <div className="grid grid-cols-3 gap-3">
              <DocCard label="ID Front"     url={item.id_front_url} />
              <DocCard label="ID Back"      url={item.id_back_url}  />
              <DocCard label="Selfie w/ ID" url={item.selfie_url}   />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        {isPending && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              onClick={() => { onClose(); onAction('reject', item.id) }}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all"
            >
              Reject
            </button>
            <button
              onClick={() => { onClose(); onAction('approve', item.id) }}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all"
            >
              Approve
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}

/* ─── action modal ────────────────────────────────────────── */

function ActionModal({ action, busy, notes, onNotes, onConfirm, onClose }: {
  action: ActionType; busy: boolean; notes: string
  onNotes: (v: string) => void; onConfirm: () => void; onClose: () => void
}) {
  const isApprove = action === 'approve'
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md z-60 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
            isApprove ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
          }`}>
            {isApprove ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-slate-800">{isApprove ? 'Approve KYC Request' : 'Reject KYC Request'}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isApprove ? 'Optional note for the approval log.' : 'Reason required for rejection.'}
            </p>
          </div>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-3">
          <label className="text-xs font-semibold text-slate-600 block">
            Review Note {!isApprove && <span className="text-red-400">*</span>}
          </label>
          <textarea
            value={notes}
            onChange={e => onNotes(e.target.value)}
            rows={4}
            placeholder={isApprove ? 'Optional note for audit trail…' : 'Explain rejection reason (min 5 characters)…'}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 bg-slate-50 text-slate-700 placeholder-slate-400 transition resize-none"
          />
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:border-slate-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60 transition-all ${
              isApprove ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {busy ? 'Processing…' : isApprove ? 'Confirm Approval' : 'Confirm Rejection'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ─── table row ───────────────────────────────────────────── */

function KycRow({ row, onView, onAction, isBusy }: {
  row: MemberKycItem
  onView: () => void
  onAction: (action: ActionType, id: number) => void
  isBusy: boolean
}) {
  const cfg  = STATUS_CONFIG[row.status]
  const name = row.customer?.name || row.full_name || 'Member'
  const isPending = row.status === 'pending_review' || row.status === 'on_hold'

  return (
    <tr className="hover:bg-slate-50/70 transition-colors">
      {/* Reference */}
      <td className="px-4 py-3.5">
        <p className="text-sm font-semibold text-slate-800">{row.reference_no}</p>
        <p className="text-xs text-slate-400 mt-0.5">#{row.id}</p>
      </td>

      {/* Member */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold bg-linear-to-br from-teal-400 to-teal-600">
            {getInitials(name)}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{name}</p>
            <p className="text-xs text-slate-400">{row.customer?.email || 'No email'}</p>
          </div>
        </div>
      </td>

      {/* KYC Data */}
      <td className="px-4 py-3.5">
        <p className="text-sm font-medium text-slate-700">{row.id_type || 'N/A'}</p>
        <p className="text-xs text-slate-400 mt-0.5">{row.id_number || 'No ID number'}</p>
      </td>

      {/* Submitted */}
      <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
        <p>{formatDate(row.created_at)}</p>
        {row.reviewed_at && (
          <p className="mt-0.5 text-slate-400">Rev: {formatDate(row.reviewed_at)}</p>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${cfg.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onView}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            View
          </button>
          {isPending && (
            <>
              <button
                onClick={() => onAction('approve', row.id)}
                disabled={isBusy}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-50 transition-all"
              >
                Approve
              </button>
              <button
                onClick={() => onAction('reject', row.id)}
                disabled={isBusy}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 disabled:opacity-50 transition-all"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

/* ─── main page ───────────────────────────────────────────── */

export default function KycVerificationPageMain() {
  const [search,  setSearch]  = useState('')
  const [page,    setPage]    = useState(1)
  const [filter,  setFilter]  = useState<FilterKey>('pending_review')
  const [busyId,  setBusyId]  = useState<number | null>(null)
  const [selected, setSelected] = useState<MemberKycItem | null>(null)
  const [actionModal, setActionModal] = useState<{
    open: boolean; action: ActionType; id: number | null; notes: string
  }>({ open: false, action: 'approve', id: null, notes: '' })

  const { data, isLoading, isFetching, isError } = useGetMembersKycQuery({
    page, perPage: 20,
    search: search.trim() || undefined,
    filter,
  })

  const [approveKyc] = useApproveMemberKycMutation()
  const [rejectKyc]  = useRejectMemberKycMutation()

  const rows = useMemo(() => data?.requests ?? [], [data?.requests])
  const counts = data?.counts

  const openActionModal = (action: ActionType, id: number) =>
    setActionModal({ open: true, action, id, notes: '' })

  const closeActionModal = () =>
    setActionModal({ open: false, action: 'approve', id: null, notes: '' })

  const handleConfirmAction = async () => {
    if (!actionModal.id) return
    const notes = actionModal.notes.trim()
    if (actionModal.action === 'reject' && notes.length < 5) {
      showErrorToast('Rejection note is required (minimum 5 characters).')
      return
    }
    setBusyId(actionModal.id)
    try {
      if (actionModal.action === 'approve') {
        await approveKyc({ id: actionModal.id, notes: notes || undefined }).unwrap()
        showSuccessToast('KYC request approved successfully.')
      } else {
        await rejectKyc({ id: actionModal.id, notes }).unwrap()
        showSuccessToast('KYC request rejected.')
      }
      closeActionModal()
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string } }
      showErrorToast(apiErr?.data?.message || 'Failed to update KYC request.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-xl font-bold text-slate-800">KYC / Verifications</h1>
          <p className="text-sm text-slate-500 mt-0.5">Review identity submissions before account activation</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow">
          <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </motion.div>

      {/* ── Stat Cards ── */}
      {counts && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            label="Pending Review" value={counts.pending_review}
            bg="bg-amber-50" text="text-amber-600" border="border-amber-100"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Approved" value={counts.approved}
            bg="bg-emerald-50" text="text-emerald-600" border="border-emerald-100"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Rejected" value={counts.rejected}
            bg="bg-red-50" text="text-red-500" border="border-red-100"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Total Requests" value={counts.all}
            bg="bg-slate-100" text="text-slate-600" border="border-slate-200"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
        </motion.div>
      )}

      {/* ── Toolbar ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 space-y-3"
      >
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search reference, full name, ID number…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 bg-slate-50 text-slate-700 placeholder-slate-400 transition"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setFilter(tab.key); setPage(1) }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                filter === tab.key
                  ? tab.key === 'all'
                    ? 'bg-slate-800 text-white border-slate-800'
                    : `${STATUS_CONFIG[tab.key as MemberKycStatus]?.tab} border-current`
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {tab.label}
              {counts && tab.key !== 'all' && (
                <span className="ml-1.5 opacity-70">
                  {counts[tab.key as MemberKycStatus] ?? 0}
                </span>
              )}
              {counts && tab.key === 'all' && (
                <span className="ml-1.5 opacity-70">{counts.all}</span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Error ── */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Failed to load KYC verification queue.
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {isLoading ? (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden animate-pulse">
          <div className="px-5 py-4 border-b border-slate-100 flex gap-3">
            <div className="h-4 w-32 bg-slate-100 rounded-lg" />
          </div>
          <div className="divide-y divide-slate-50">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-4 py-4 flex items-center gap-4">
                <div className="h-9 w-9 rounded-full bg-slate-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-36 bg-slate-100 rounded" />
                  <div className="h-2.5 w-24 bg-slate-100 rounded" />
                </div>
                <div className="h-6 w-20 bg-slate-100 rounded-full" />
                <div className="h-7 w-16 bg-slate-100 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          {/* Fetching progress */}
          {isFetching && (
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-1/3 animate-pulse rounded-full bg-teal-400" />
            </div>
          )}

          {/* Table */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800">Verification Requests</h2>
              <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full font-medium">
                {rows.length} shown
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-225">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {['Reference', 'Member', 'KYC Data', 'Submitted', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {rows.length ? (
                    rows.map(row => (
                      <KycRow
                        key={row.id}
                        row={row}
                        onView={() => setSelected(row)}
                        onAction={openActionModal}
                        isBusy={busyId === row.id}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-14 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="text-sm font-semibold text-slate-500">No KYC requests found</p>
                          <p className="text-xs text-slate-400">Try adjusting your search or filter</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>
                Showing{' '}
                <span className="font-semibold text-slate-600">
                  {data?.meta?.from ?? 0}–{data?.meta?.to ?? 0}
                </span>{' '}
                of <span className="font-semibold text-slate-600">{data?.meta?.total ?? 0}</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={(data?.meta?.current_page ?? 1) <= 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Prev
                </button>
                <span className="px-2 text-slate-500">
                  {data?.meta?.current_page ?? 1} / {data?.meta?.last_page ?? 1}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={(data?.meta?.current_page ?? 1) >= (data?.meta?.last_page ?? 1)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selected && (
          <DetailModal
            item={selected}
            onClose={() => setSelected(null)}
            onAction={openActionModal}
          />
        )}
      </AnimatePresence>

      {/* ── Action Modal ── */}
      <AnimatePresence>
        {actionModal.open && (
          <ActionModal
            action={actionModal.action}
            busy={busyId === actionModal.id}
            notes={actionModal.notes}
            onNotes={v => setActionModal(prev => ({ ...prev, notes: v }))}
            onConfirm={handleConfirmAction}
            onClose={closeActionModal}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
