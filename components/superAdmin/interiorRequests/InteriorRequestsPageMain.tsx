'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  InteriorRequestStatus,
  InteriorRequestUpdateType,
  useGetAdminInteriorRequestsQuery,
  useReplyAdminInteriorRequestMutation,
  useUpdateAdminInteriorRequestMutation,
} from '@/store/api/interiorRequestsApi'

const statusMeta: Record<InteriorRequestStatus, { label: string; pill: string }> = {
  pending: { label: 'Pending', pill: 'bg-amber-50 text-amber-700 border-amber-200' },
  reviewing: { label: 'Reviewing', pill: 'bg-sky-50 text-sky-700 border-sky-200' },
  estimate_ready: { label: 'Estimate Ready', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  scheduled: { label: 'Scheduled', pill: 'bg-violet-50 text-violet-700 border-violet-200' },
  completed: { label: 'Completed', pill: 'bg-green-50 text-green-700 border-green-200' },
  cancelled: { label: 'Cancelled', pill: 'bg-rose-50 text-rose-700 border-rose-200' },
}

const updateDot: Record<InteriorRequestUpdateType, string> = {
  message: 'bg-slate-400',
  estimate: 'bg-emerald-500',
  design: 'bg-fuchsia-500',
  schedule: 'bg-sky-500',
}

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

  const selected = useMemo(
    () => {
      if (!requests.length) return null
      if (selectedId > 0) {
        return requests.find((request) => request.id === selectedId) ?? requests[0]
      }
      if (highlightedRequest > 0) {
        return requests.find((request) => request.id === highlightedRequest) ?? requests[0]
      }
      return requests[0]
    },
    [highlightedRequest, requests, selectedId],
  )

  const effectiveReplyStatus: InteriorRequestStatus = selected
    ? (replyStatus || (selected.status === 'pending' ? 'reviewing' : selected.status))
    : 'reviewing'

  const stats = useMemo(() => {
    const total = requests.length
    const priority = requests.filter((request) => request.priority === 'priority').length
    const estimateReady = requests.filter((request) => request.status === 'estimate_ready').length
    const scheduled = requests.filter((request) => request.status === 'scheduled').length
    return { total, priority, estimateReady, scheduled }
  }, [requests])

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
        body: {
          status: effectiveReplyStatus,
          priority: selected.priority,
        },
      }).unwrap()
      setFeedback({ type: 'success', text: 'Request status updated.' })
    } catch {
      setFeedback({ type: 'error', text: 'Could not save the request changes.' })
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
          ? 'Update sent to the customer inbox and email.'
          : 'Internal admin note saved.',
      })
    } catch {
      setFeedback({ type: 'error', text: 'Could not post the admin update right now.' })
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
        Loading interior requests...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600 shadow-sm">
        We could not load the interior request queue right now.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Interior Services</p>
            <h1 className="mt-2 text-xl font-bold text-slate-900 md:text-2xl">Interior Requests</h1>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-500">
              Review incoming design requests, assign consultations, and send account-specific estimates or concept updates back to customers.
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-cyan-700">Secure Delivery</p>
            <p className="mt-1 text-sm font-medium text-cyan-900">Customer-visible replies trigger inbox notifications and email links back to the request.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Total Requests</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">Priority Queue</p>
            <p className="mt-1 text-2xl font-bold text-amber-900">{stats.priority}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">Estimate Ready</p>
            <p className="mt-1 text-2xl font-bold text-emerald-900">{stats.estimateReady}</p>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-700">Scheduled</p>
            <p className="mt-1 text-2xl font-bold text-violet-900">{stats.scheduled}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-slate-900">Incoming Requests</h2>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'all' | InteriorRequestStatus)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
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

          <div className="mt-4 space-y-3">
            {requests.map((request) => {
              const active = selected?.id === request.id
              return (
                <button
                  key={request.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(request.id)
                    setReplyStatus(request.status === 'pending' ? 'reviewing' : request.status)
                  }}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    active
                      ? 'border-cyan-300 bg-cyan-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{request.reference}</p>
                      <p className="mt-1 line-clamp-2 text-sm font-bold text-slate-900">{request.project_type}</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusMeta[request.status].pill}`}>
                      {statusMeta[request.status].label}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">{request.customer?.name || `${request.first_name} ${request.last_name}`} · {request.service_type}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{request.email}</p>
                </button>
              )
            })}
          </div>
        </div>

        {selected ? (
          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{selected.reference}</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">{selected.project_type}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {(selected.customer?.name || `${selected.first_name} ${selected.last_name}`).trim()} · {selected.email}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${statusMeta[selected.status].pill}`}>
                    {statusMeta[selected.status].label}
                  </span>
                  {selected.priority === 'priority' && (
                    <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
                      Priority
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Property Type</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{selected.property_type || 'Not provided'}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Budget</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{selected.budget || 'Not provided'}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Preferred Schedule</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{formatDateTime(selected.preferred_date, selected.preferred_time)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Assigned To</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{selected.assigned_admin?.name || 'Unassigned'}</p>
                </div>
              </div>

              {selected.notes && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Client Notes</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{selected.notes}</p>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Request Actions</h3>
                  <p className="mt-0.5 text-xs text-slate-500">Use visible replies for customer notifications and email alerts. Internal notes can stay admin-only.</p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleAssignToMe()}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  Assign To Me
                </button>
              </div>

              {feedback && (
                <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                  feedback.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-red-200 bg-red-50 text-red-600'
                }`}>
                  {feedback.text}
                </div>
              )}

              <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Request Controls</p>
                  <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Status</label>
                  <select
                    value={effectiveReplyStatus}
                    onChange={(event) => setReplyStatus(event.target.value as InteriorRequestStatus)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
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
                    className="mt-4 w-full rounded-xl bg-cyan-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSavingRequest ? 'Saving...' : 'Save Request Status'}
                  </button>

                  <div className="mt-4 rounded-xl border border-slate-200 bg-white px-3 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Working Admin</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{currentAdminName}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Post Update</p>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Update Type</label>
                      <select
                        value={replyType}
                        onChange={(event) => setReplyType(event.target.value as InteriorRequestUpdateType)}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
                      >
                        <option value="message">Message</option>
                        <option value="estimate">Estimate</option>
                        <option value="design">Design</option>
                        <option value="schedule">Schedule</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Title</label>
                      <input
                        value={replyTitle}
                        onChange={(event) => setReplyTitle(event.target.value)}
                        placeholder="Short customer-facing title"
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Message</label>
                    <textarea
                      value={replyMessage}
                      onChange={(event) => setReplyMessage(event.target.value)}
                      rows={5}
                      placeholder="Write the estimate note, schedule update, design message, or internal comment here."
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100"
                    />
                  </div>

                  <label className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={replyVisible}
                      onChange={(event) => setReplyVisible(event.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">Visible to customer</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                        If checked, the customer receives an inbox notification and an email with a direct link back to this request.
                      </span>
                    </span>
                  </label>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => void handleSendReply()}
                      disabled={isSendingReply || !replyTitle.trim() || !replyMessage.trim()}
                      className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSendingReply ? 'Sending...' : replyVisible ? 'Send Update To Customer' : 'Save Internal Note'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <h3 className="text-base font-bold text-slate-900">Request Timeline</h3>
              <p className="mt-0.5 text-xs text-slate-500">Every update is attached to the request and can optionally be exposed to the customer inbox.</p>

              <div className="mt-5 space-y-4">
                {selected.updates.map((update, index) => (
                  <div key={update.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={`mt-1 h-2.5 w-2.5 rounded-full ${updateDot[update.type]}`} />
                      {index !== selected.updates.length - 1 && <span className="mt-2 h-full min-h-10 w-px bg-slate-200" />}
                    </div>
                    <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{update.type}</p>
                          <h4 className="mt-1 text-sm font-bold text-slate-900">{update.title}</h4>
                        </div>
                        <span className="text-xs text-slate-400">{formatTimestamp(update.created_at)}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{update.message}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        {update.actor_admin?.name && <span>By {update.actor_admin.name}</span>}
                        <span>{update.visible_to_customer ? 'Visible to customer' : 'Internal only'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
            No interior requests found for this filter.
          </div>
        )}
      </div>
    </div>
  )
}
