'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import {
  Clock,
  Eye,
  FileText,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Inbox,
  UserCheck,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import {
  InteriorRequestItem,
  InteriorRequestStatus,
  InteriorRequestUpdateType,
  useGetMyInteriorRequestsQuery,
} from '@/store/api/interiorRequestsApi';

/* ─── Config ─────────────────────────────────────────────────────────────────── */
const statusMeta: Record<
  InteriorRequestStatus,
  { label: string; pill: string; icon: React.ReactNode; tone: string }
> = {
  pending: {
    label: 'Pending Review',
    tone: 'text-amber-700',
    pill: 'bg-amber-50 border-amber-200 text-amber-700',
    icon: <Clock className="h-3 w-3" />,
  },
  reviewing: {
    label: 'Reviewing',
    tone: 'text-sky-700',
    pill: 'bg-sky-50 border-sky-200 text-sky-700',
    icon: <Eye className="h-3 w-3" />,
  },
  estimate_ready: {
    label: 'Estimate Ready',
    tone: 'text-emerald-700',
    pill: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    icon: <FileText className="h-3 w-3" />,
  },
  scheduled: {
    label: 'Scheduled',
    tone: 'text-violet-700',
    pill: 'bg-violet-50 border-violet-200 text-violet-700',
    icon: <CalendarCheck className="h-3 w-3" />,
  },
  completed: {
    label: 'Completed',
    tone: 'text-green-700',
    pill: 'bg-green-50 border-green-200 text-green-700',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  cancelled: {
    label: 'Cancelled',
    tone: 'text-rose-700',
    pill: 'bg-rose-50 border-rose-200 text-rose-700',
    icon: <XCircle className="h-3 w-3" />,
  },
};

const updateMeta: Record<
  InteriorRequestUpdateType,
  { label: string; dot: string; badge: string }
> = {
  message: {
    label: 'Admin Note',
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
};

const statusOrder: InteriorRequestStatus[] = [
  'pending', 'reviewing', 'estimate_ready', 'scheduled', 'completed', 'cancelled',
];

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
const formatDateTime = (date?: string | null, time?: string | null) => {
  if (!date && !time) return 'Awaiting confirmation';
  if (!date) return time || 'Awaiting confirmation';
  const parsed = new Date(date);
  const displayDate = Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
  return time ? `${displayDate} · ${time}` : displayDate;
};

const formatTimestamp = (value?: string | null) => {
  if (!value) return 'Just now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/* ─── Main component ─────────────────────────────────────────────────────────── */
export default function InteriorRequestsTab() {
  const searchParams = useSearchParams();
  const highlightedRequest = Number(searchParams.get('request') ?? 0);
  const { data, isLoading, isError } = useGetMyInteriorRequestsQuery();
  const requests = useMemo(() => data?.requests ?? [], [data?.requests]);
  const [selectedRequestId, setSelectedRequestId] = useState<number>(0);

  const selectedRequest = useMemo(() => {
    if (!requests.length) return null;
    if (selectedRequestId > 0) return requests.find((r) => r.id === selectedRequestId) ?? requests[0];
    if (highlightedRequest > 0) return requests.find((r) => r.id === highlightedRequest) ?? requests[0];
    return requests[0];
  }, [highlightedRequest, requests, selectedRequestId]);

  const summary = useMemo(
    () => statusOrder.map((status) => ({
      status,
      count: requests.filter((r) => r.status === status).length,
    })),
    [requests],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-16 shadow-sm">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          <p className="mt-3 text-sm text-slate-500">Loading your interior requests…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
        <p className="text-sm text-red-700">Could not load your interior request inbox. Please try again.</p>
      </div>
    );
  }

  if (!requests.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
            <Inbox className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Interior Requests</h3>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-slate-500">
              You don't have any interior service requests yet. Once you submit a booking from the Interior Services page, your updates and project inbox will appear here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* ── Header + Status summary ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50">
              <Inbox className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 sm:text-lg">Interior Requests</h3>
              <p className="mt-0.5 max-w-lg text-xs leading-relaxed text-slate-500">
                Secure updates for your design consultations, estimates, schedules, and project messages.
              </p>
            </div>
          </div>
          <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
            Authenticated access only
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 xl:grid-cols-6">
          {summary.map(({ status, count }) => {
            const meta = statusMeta[status];
            return (
              <div
                key={status}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 sm:px-4"
              >
                <div className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide sm:text-[11px] ${meta.tone}`}>
                  {meta.icon}
                  {meta.label}
                </div>
                <p className="mt-1.5 text-2xl font-bold text-slate-900">{count}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Requests list + Detail ── */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">

        {/* Request list */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <MessageSquare className="h-4 w-4 text-slate-400" />
              My Requests
            </h4>
            <span className="text-xs font-medium text-slate-400">{requests.length} total</span>
          </div>

          <div className="space-y-2">
            {requests.map((request) => {
              const active = request.id === selectedRequest?.id;
              const meta = statusMeta[request.status];
              return (
                <button
                  key={request.id}
                  type="button"
                  onClick={() => setSelectedRequestId(request.id)}
                  className={`w-full rounded-xl border p-3.5 text-left transition-all ${
                    active
                      ? 'border-orange-300 bg-orange-50 shadow-sm'
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
                    {request.service_type} · {request.property_type || 'Property TBD'}
                  </p>
                  <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-slate-400">
                    {request.latest_update?.message || 'Waiting for the next admin update.'}
                  </p>
                  {active && (
                    <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-orange-600">
                      <span>Viewing</span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail */}
        {selectedRequest && (
          <motion.div
            key={selectedRequest.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <RequestHeader selectedRequest={selectedRequest} />

            {/* Project inbox */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="flex items-center gap-2 text-base font-bold text-slate-900">
                    <MessageSquare className="h-4 w-4 text-slate-400" />
                    Project Inbox
                  </h4>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Only updates tied to your account appear here.
                  </p>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500">
                  {selectedRequest.updates.length} {selectedRequest.updates.length === 1 ? 'update' : 'updates'}
                </span>
              </div>

              {selectedRequest.updates.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                  <p className="text-sm text-slate-400">No updates from the team yet. Check back soon.</p>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {selectedRequest.updates.map((update, index) => {
                    const meta = updateMeta[update.type];
                    return (
                      <div key={update.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${meta.dot}`} />
                          {index !== selectedRequest.updates.length - 1 && (
                            <span className="mt-2 h-full min-h-10 w-px bg-slate-200" />
                          )}
                        </div>
                        <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${meta.badge}`}>
                                {meta.label}
                              </span>
                              <h5 className="text-sm font-semibold text-slate-900">{update.title}</h5>
                            </div>
                            <span className="text-[11px] text-slate-400">{formatTimestamp(update.created_at)}</span>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-slate-600">{update.message}</p>
                          {update.actor_admin?.name && (
                            <p className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-slate-400">
                              <UserCheck className="h-3 w-3" />
                              Posted by {update.actor_admin.name}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Next steps */}
            <div className="rounded-2xl border border-orange-200 bg-linear-to-br from-orange-50 to-amber-50 p-5 md:p-6">
              <h4 className="text-base font-bold text-slate-900">What Happens Next</h4>
              <p className="mt-0.5 text-xs text-slate-500">Your admin team will walk you through each step below.</p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {[
                  {
                    icon: <FileText className="h-4 w-4 text-orange-500" />,
                    label: 'Estimate',
                    desc: 'Review costing and scope once the admin uploads your quotation.',
                  },
                  {
                    icon: <Eye className="h-4 w-4 text-orange-500" />,
                    label: 'Design Files',
                    desc: 'Concept directions and design updates stay tied to this request.',
                  },
                  {
                    icon: <CalendarCheck className="h-4 w-4 text-orange-500" />,
                    label: 'Schedule',
                    desc: 'Consultation and site-visit confirmations appear here and in your email.',
                  },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-orange-200 bg-white/80 px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <p className="text-xs font-bold uppercase tracking-wide text-orange-600">{item.label}</p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ─── Request header sub-component ──────────────────────────────────────────── */
function RequestHeader({ selectedRequest }: { selectedRequest: InteriorRequestItem }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {selectedRequest.reference}
          </p>
          <h4 className="mt-1 text-lg font-bold leading-tight text-slate-900 sm:text-xl">
            {selectedRequest.project_type}
          </h4>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            {selectedRequest.service_type} for {selectedRequest.property_type || 'your property'}
          </p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusMeta[selectedRequest.status].pill}`}>
          {statusMeta[selectedRequest.status].icon}
          {statusMeta[selectedRequest.status].label}
        </span>
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Preferred Schedule',
            value: formatDateTime(selectedRequest.preferred_date, selectedRequest.preferred_time),
          },
          {
            label: 'Assigned Admin',
            value: selectedRequest.assigned_admin?.name || 'Unassigned',
          },
          {
            label: 'Budget Range',
            value: selectedRequest.budget || 'Not provided',
          },
          {
            label: 'Target Timeline',
            value: selectedRequest.target_timeline || 'To be discussed',
          },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{item.label}</p>
            <p className="mt-1 text-sm font-semibold leading-snug text-slate-800">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
