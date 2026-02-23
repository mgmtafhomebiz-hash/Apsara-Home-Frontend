'use client'

import { MemberStatus } from "@/types/members/types"

const statusMap: Record<MemberStatus, { label: string; className: string; dot: string }> = {
  active:     { label: 'Active',     className: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  pending:    { label: 'Pending',    className: 'bg-amber-100  text-amber-700',    dot: 'bg-amber-500'   },
  blocked:    { label: 'Blocked',    className: 'bg-red-100    text-red-700',      dot: 'bg-red-500'     },
  kyc_review: { label: 'KYC Review', className: 'bg-sky-100    text-sky-700',      dot: 'bg-sky-500'     },
}

const MembersStatusBadge = ({ status }: { status: MemberStatus }) => {
  const cfg = statusMap[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

export default MembersStatusBadge
