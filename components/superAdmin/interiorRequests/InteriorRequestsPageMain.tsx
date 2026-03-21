'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  LayoutList,
  Clock,
  FileText,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  BarChart3,
  UserCheck,
  AlertTriangle,
  Send,
  ChevronRight,
  EyeOff,
  Inbox,
} from 'lucide-react'
import {
  InteriorRequestStatus,
  InteriorRequestUpdateType,
  useGetAdminInteriorRequestsQuery,
  useReplyAdminInteriorRequestMutation,
  useUpdateAdminInteriorRequestMutation,
} from '@/store/api/interiorRequestsApi'

/* ─── Status config ─────────────────────────────────────────────────────────── */
const statusMeta: Record<
  InteriorRequestStatus,
  { label: string; pill: string; bar: string; icon: React.ReactNode }
> = {
  pending: {
    label: 'Pending',
    pill: 'bg-amber-50 text-amber-700 border-amber-200',
    bar: 'bg-amber-400',
    icon: <Clock className="h-3 w-3" />,
  },
  reviewing: {
    label: 'Reviewing',
    pill: 'bg-sky-50 text-sky-700 border-sky-200',
    bar: 'bg-sky-400',
    icon: <Eye className="h-3 w-3" />,
  },
  estimate_ready: {
    label: 'Estimate Ready',
    pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    bar: 'bg-emerald-500',
    icon: <FileText className="h-3 w-3" />,
  },
  scheduled: {
    label: 'Scheduled',
    pill: 'bg-violet-50 text-violet-700 border-violet-200',
    bar: 'bg-violet-500',
    icon: <CalendarCheck className="h-3 w-3" />,
  },
  completed: {
    label: 'Completed',
    pill: 'bg-green-50 text-green-700 border-green-200',
    bar: 'bg-green-500',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  cancelled: {
    label: 'Cancelled',
    pill: 'bg-rose-50 text-rose-700 border-rose-200',
    bar: 'bg-rose-400',
    icon: <XCircle className="h-3 w-3" />,
  },
}

/* ─── Update type config ────────────────────────────────────────────────────── */
const updateMeta: Record<
  InteriorRequestUpdateType,
  { label: string; dot: string; badge: string }
> = {
  message: {
    label: 'Message',
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-600',
  },
  estimate: {
    label: 'Estimate',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700',
  },
  design: {
    label: 'Design',
    dot: 'bg-fuchsia-500',
    badge: 'bg-fuchsia-50 text-fuchsia-700',
  },
  schedule: {
    label: 'Schedule',
    dot: 'bg-sky-500',
    badge: 'bg-sky-50 text-sky-700',
  },
}

/* ─── Helpers ───────────────────────────────────────────────────────────────── */
const formatDateTime = (date?: string | null, time?: string | null) => {
  if (!date && !time) return 'Awaiting confirmation'
  if (!date) return time || 'Awaiting confirmation'
  const parsed = new Date(date)
  const displayDate = Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
  return time ? `${displayDate} · ${time}` : displayDate
}

const formatTimestamp = (value?: string | null) => {
  if (!value) return 'Just now'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/* ─── Component ─────────────────────────────────────────────────────────────── */
export default function InteriorRequestsPageMain() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const highlightedRequest = Number(searchParams.get('request') ?? 0)

  const [statusFilter, setStatusFilter] = useState<'all' | InteriorRequestStatus>('all')
  const [selectedId, setSelectedId] = useState<number>(0)
  const [replyType, setReplyType] = useState<InteriorRequestUpdateType>('message')
  const [replyTitle, setReplyTitle] = useState('')
  const [replyMessage, setReplyMessage] = useState('')
  const [replyVisible, setReplyVisible] = useState(true)
  const [replyStatus, setReplyStatus] = useState<InteriorRequestStatus | ''>('')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const { data, isLoading, isError } = useGetAdminInteriorRequestsQuery(
    statusFilter === 'all' ? undefined : { status: statusFilter },
  )
  const [updateRequest, { isLoading: isSavingRequest }] = useUpdateAdminInteriorRequestMutation()
  const [replyRequest, { isLoading: isSendingReply }] = useReplyAdminInteriorRequestMutation()

  const requests = useMemo(() => data?.requests ?? [], [data?.requests])

  const selected = useMemo(() => {
    if (!requests.length) return null
    if (selectedId > 0) return requests.find((r) => r.id === selectedId) ?? requests[0]
    if (highlightedRequest > 0) return requests.find((r) => r.id === highlightedRequest) ?? requests[0]
    return requests[0]
  }, [highlightedRequest, requests, selectedId])

  const effectiveReplyStatus: InteriorRequestStatus = selected
    ? (replyStatus || (selected.status === 'pending' ? 'reviewing' : selected.status))
    : 'reviewing'

  const stats = useMemo(() => ({
    total: requests.length,
    priority: requests.filter((r) => r.priority === 'priority').length,
    estimateReady: requests.filter((r) => r.status === 'estimate_ready').length,
    scheduled: requests.filter((r) => r.status === 'scheduled').length,
  }), [requests])

  const currentAdminName = session?.user?.name?.trim() || 'Admin'

  const handleAssignToMe = async () => {
    if (!selected) return
    setFeedback(null)
    try {
      await updateRequest({
        id: selected.id,
        body: {
          assign_to_me: true,
          status: selected.status === 'pending' ? 'reviewing' : selected.status,
          priority: selected.priority,
        },
      }).unwrap()
      setFeedback({ type: 'success', text: 'Request assigned to your account.' })
    } catch {
      setFeedback({ type: 'error', text: 'Could not assign this request right now.' })
    }
  }

  const handleSaveRequest = async () => {
    if (!selected) return
    setFeedback(null)
    try {
      await updateRequest({
        id: selected.id,
        body: { status: effectiveReplyStatus, priority: selected.priority },
      }).unwrap()
      setFeedback({ type: 'success', text: 'Status updated successfully.' })
    } catch {
      setFeedback({ type: 'error', text: 'Could not save request changes.' })
    }
  }

  const handleSendReply = async () => {
    if (!selected || !replyTitle.trim() || !replyMessage.trim()) return
    setFeedback(null)
    try {
      await replyRequest({
        id: selected.id,
        body: {
          type: replyType,
          title: replyTitle.trim(),
          message: replyMessage.trim(),
          visible_to_customer: replyVisible,
          status: effectiveReplyStatus,
          assign_to_me: true,
        },
      }).unwrap()
      setReplyTitle('')
      setReplyMessage('')
      setReplyType('message')
      setReplyVisible(true)
      setFeedback({
        type: 'success',
        text: replyVisible
          ? 'Update sent to customer inbox and email.'
          : 'Internal note saved.',
      })
    } catch {
      setFeedback({ type: 'error', text: 'Could not post the update right now.' })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-16 shadow-sm">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent" />
          <p className="mt-3 text-sm text-slate-500">Loading interior requests…</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
        <p className="text-sm text-red-700">Could not load the interior request queue. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">

      {/* ── Page header ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50">
              <Inbox className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-600">Interior Services</p>
              <h1 className="mt-0.5 text-xl font-bold text-slate-900 md:text-2xl">Quotation Requests</h1>
              <p className="mt-1 max-w-xl text-sm text-slate-500">
                Review design requests, assign consultations, and send estimates or concept updates directly to customers.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-cyan-100 bg-cyan-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-cyan-700">Secure Delivery</p>
            <p className="mt-1 max-w-55 text-xs text-cyan-800">
              Visible replies trigger inbox notifications and email alerts for the customer.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: <BarChart3 className="h-4 w-4 text-slate-400" />, label: 'Total Requests', value: stats.total, color: 'border-slate-200 bg-slate-50' },
            { icon: <AlertTriangle className="h-4 w-4 text-amber-500" />, label: 'Priority Queue', value: stats.priority, color: 'border-amber-200 bg-amber-50' },
            { icon: <FileText className="h-4 w-4 text-emerald-500" />, label: 'Estimate Ready', value: stats.estimateReady, color: 'border-emerald-200 bg-emerald-50' },
            { icon: <CalendarCheck className="h-4 w-4 text-violet-500" />, label: 'Scheduled', value: stats.scheduled, color: 'border-violet-200 bg-violet-50' },
          ].map((stat) => (
            <div key={stat.label} className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 ${stat.color}`}>
              <div className="shrink-0">{stat.icon}</div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{stat.label}</p>
                <p className="mt-0.5 text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main panel ── */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">

        {/* Request list */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <LayoutList className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900">Incoming Requests</h2>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | InteriorRequestStatus)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="estimate_ready">Estimate Ready</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="mt-4 space-y-2">
            {requests.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                <p className="text-sm text-slate-400">No requests for this filter.</p>
              </div>
            ) : (
              requests.map((request) => {
                const active = selected?.id === request.id
                const meta = statusMeta[request.status]
                return (
                  <button
                    key={request.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(request.id)
                      setReplyStatus(request.status === 'pending' ? 'reviewing' : request.status)
                    }}
                    className={`group w-full rounded-xl border p-3.5 text-left transition-all ${
                      active
                        ? 'border-cyan-300 bg-cyan-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                          {request.reference}
                        </p>
                        <p className="mt-1 line-clamp-1 text-sm font-semibold text-slate-900">
                          {request.project_type}
                        </p>
                      </div>
                      <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${meta.pill}`}>
                        {meta.icon}
                        {meta.label}
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">
                      {request.customer?.name || `${request.first_name} ${request.last_name}`}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{request.service_type}</p>
                    {active && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-cyan-600">
                        <span>Viewing</span>
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selected ? (
          <div className="space-y-4">

            {/* Request header */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{selected.reference}</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">{selected.project_type}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {(selected.customer?.name || `${selected.first_name} ${selected.last_name}`).trim()}
                    {' · '}
                    <span className="text-slate-400">{selected.email}</span>
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusMeta[selected.status].pill}`}>
                    {statusMeta[selected.status].icon}
                    {statusMeta[selected.status].label}
                  </span>
                  {selected.priority === 'priority' && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
                      <AlertTriangle className="h-3 w-3" />
                      Priority
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Property Type', value: selected.property_type || 'Not provided' },
                  { label: 'Budget', value: selected.budget || 'Not provided' },
                  { label: 'Preferred Schedule', value: formatDateTime(selected.preferred_date, selected.preferred_time) },
                  { label: 'Assigned To', value: selected.assigned_admin?.name || 'Unassigned' },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{item.label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{item.value}</p>
                  </div>
                ))}
              </div>

              {selected.notes && (
                <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-600">Client Notes</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{selected.notes}</p>
                </div>
              )}
            </div>

            {/* Actions panel */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Request Actions</h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Visible replies notify the customer via inbox and email. Internal notes stay admin-only.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleAssignToMe()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  Assign To Me
                </button>
              </div>

              {feedback && (
                <div className={`mt-4 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${
                  feedback.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-red-200 bg-red-50 text-red-600'
                }`}>
                  {feedback.type === 'success'
                    ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  }
                  {feedback.text}
                </div>
              )}

              <div className="mt-5 grid gap-4 lg:grid-cols-[200px_minmax(0,1fr)]">

                {/* Left: Status controls */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Status Control</p>

                  <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Set Status
                  </label>
                  <select
                    value={effectiveReplyStatus}
                    onChange={(e) => setReplyStatus(e.target.value as InteriorRequestStatus)}
                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="estimate_ready">Estimate Ready</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => void handleSaveRequest()}
                    disabled={isSavingRequest}
                    className="mt-3 w-full rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSavingRequest ? 'Saving…' : 'Save Status'}
                  </button>

                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Working As</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{currentAdminName}</p>
                  </div>
                </div>

                {/* Right: Post update */}
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Post Update</p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Update Type</label>
                      <select
                        value={replyType}
                        onChange={(e) => setReplyType(e.target.value as InteriorRequestUpdateType)}
                        className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
                      >
                        <option value="message">Message</option>
                        <option value="estimate">Estimate</option>
                        <option value="design">Design</option>
                        <option value="schedule">Schedule</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Title</label>
                      <input
                        value={replyTitle}
                        onChange={(e) => setReplyTitle(e.target.value)}
                        placeholder="Short, customer-facing title"
                        className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Message</label>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={4}
                      placeholder="Write the estimate note, schedule update, design message, or internal comment here."
                      className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
                    />
                  </div>

                  <div className="mt-3 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={replyVisible}
                      onChange={(e) => setReplyVisible(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    <div>
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                        {replyVisible
                          ? <><Eye className="h-3.5 w-3.5 text-cyan-600" /> Visible to customer</>
                          : <><EyeOff className="h-3.5 w-3.5 text-slate-400" /> Internal note only</>
                        }
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {replyVisible
                          ? 'Customer receives an inbox notification and email with a link to this request.'
                          : 'Only admins can see this note. The customer will not be notified.'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => void handleSendReply()}
                      disabled={isSendingReply || !replyTitle.trim() || !replyMessage.trim()}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Send className="h-3.5 w-3.5" />
                      {isSendingReply
                        ? 'Sending…'
                        : replyVisible
                        ? 'Send to Customer'
                        : 'Save Internal Note'
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
                    <MessageSquare className="h-4 w-4 text-slate-400" />
                    Request Timeline
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    All updates attached to this request, newest first.
                  </p>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                  {selected.updates.length} {selected.updates.length === 1 ? 'update' : 'updates'}
                </span>
              </div>

              {selected.updates.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                  <p className="text-sm text-slate-400">No updates posted yet.</p>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {selected.updates.map((update, index) => {
                    const meta = updateMeta[update.type]
                    return (
                      <div key={update.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${meta.dot}`} />
                          {index !== selected.updates.length - 1 && (
                            <span className="mt-2 h-full min-h-10 w-px bg-slate-200" />
                          )}
                        </div>
                        <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${meta.badge}`}>
                                {meta.label}
                              </span>
                              <h4 className="text-sm font-semibold text-slate-900">{update.title}</h4>
                            </div>
                            <span className="text-[11px] text-slate-400">{formatTimestamp(update.created_at)}</span>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-slate-600">{update.message}</p>
                          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                            {update.actor_admin?.name && (
                              <span className="flex items-center gap-1">
                                <UserCheck className="h-3 w-3" />
                                {update.actor_admin.name}
                              </span>
                            )}
                            <span className={`flex items-center gap-1 font-medium ${update.visible_to_customer ? 'text-cyan-600' : 'text-slate-400'}`}>
                              {update.visible_to_customer
                                ? <><Eye className="h-3 w-3" /> Visible to customer</>
                                : <><EyeOff className="h-3 w-3" /> Internal only</>
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-16 shadow-sm">
            <Inbox className="h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-500">No request selected</p>
            <p className="mt-1 text-xs text-slate-400">Pick a request from the list to view details.</p>
          </div>
        )}

      </div>
    </div>
  )
}
