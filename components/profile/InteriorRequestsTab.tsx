'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { InteriorRequestItem, InteriorRequestStatus, InteriorRequestUpdateType, useGetMyInteriorRequestsQuery } from '@/store/api/interiorRequestsApi';

const statusMeta: Record<InteriorRequestStatus, { label: string; tone: string; pill: string }> = {
  pending: {
    label: 'Pending Review',
    tone: 'text-amber-700',
    pill: 'bg-amber-50 border-amber-200 text-amber-700',
  },
  reviewing: {
    label: 'Reviewing',
    tone: 'text-sky-700',
    pill: 'bg-sky-50 border-sky-200 text-sky-700',
  },
  estimate_ready: {
    label: 'Estimate Ready',
    tone: 'text-emerald-700',
    pill: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  },
  scheduled: {
    label: 'Scheduled',
    tone: 'text-violet-700',
    pill: 'bg-violet-50 border-violet-200 text-violet-700',
  },
  completed: {
    label: 'Completed',
    tone: 'text-green-700',
    pill: 'bg-green-50 border-green-200 text-green-700',
  },
  cancelled: {
    label: 'Cancelled',
    tone: 'text-rose-700',
    pill: 'bg-rose-50 border-rose-200 text-rose-700',
  },
};

const updateMeta: Record<InteriorRequestUpdateType, { label: string; accent: string; dot: string }> = {
  message: {
    label: 'Admin Note',
    accent: 'text-slate-700',
    dot: 'bg-slate-400',
  },
  estimate: {
    label: 'Estimate',
    accent: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  design: {
    label: 'Design',
    accent: 'text-fuchsia-700',
    dot: 'bg-fuchsia-500',
  },
  schedule: {
    label: 'Schedule',
    accent: 'text-sky-700',
    dot: 'bg-sky-500',
  },
};

const statusOrder: InteriorRequestStatus[] = ['pending', 'reviewing', 'estimate_ready', 'scheduled', 'completed', 'cancelled'];

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

export default function InteriorRequestsTab() {
  const searchParams = useSearchParams();
  const highlightedRequest = Number(searchParams.get('request') ?? 0);
  const { data, isLoading, isError } = useGetMyInteriorRequestsQuery();
  const requests = useMemo(() => data?.requests ?? [], [data?.requests]);
  const [selectedRequestId, setSelectedRequestId] = useState<number>(0);

  const selectedRequest = useMemo(
    () => {
      if (!requests.length) return null;
      if (selectedRequestId > 0) {
        return requests.find((request) => request.id === selectedRequestId) ?? requests[0];
      }
      if (highlightedRequest > 0) {
        return requests.find((request) => request.id === highlightedRequest) ?? requests[0];
      }
      return requests[0];
    },
    [highlightedRequest, requests, selectedRequestId],
  );

  const summary = useMemo(
    () =>
      statusOrder.map((status) => ({
        status,
        count: requests.filter((request) => request.status === status).length,
      })),
    [requests],
  );

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
        Loading your interior requests...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600 shadow-sm">
        We could not load your interior request inbox right now.
      </div>
    );
  }

  if (!requests.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">Interior Requests</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          You do not have any interior service requests yet. Once you submit a booking from the interior-services page, your admin updates and email-linked inbox will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 sm:text-lg">Interior Requests</h3>
            <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-slate-500 sm:text-xs">
              Secure updates for your design consultations, estimates, schedules, and account-linked project messages.
            </p>
          </div>
          <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700 sm:px-3 sm:text-xs">
            Authenticated access only
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3 md:grid-cols-3 xl:grid-cols-6">
          {summary.map(({ status, count }) => (
            <div key={status} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 sm:px-4">
              <p className={`text-[10px] font-semibold uppercase tracking-wide sm:text-[11px] ${statusMeta[status].tone}`}>
                {statusMeta[status].label}
              </p>
              <p className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">{count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm sm:p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">My Requests</h4>
            <span className="text-xs font-medium text-slate-400">{requests.length} total</span>
          </div>

          <div className="space-y-3">
            {requests.map((request) => {
              const active = request.id === selectedRequest?.id;
              return (
                <button
                  key={request.id}
                  type="button"
                  onClick={() => setSelectedRequestId(request.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition-all ${
                    active
                      ? 'border-orange-300 bg-orange-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{request.reference}</p>
                      <p className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-slate-900">{request.project_type}</p>
                    </div>
                    <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold sm:px-2.5 sm:text-[11px] ${statusMeta[request.status].pill}`}>
                      {statusMeta[request.status].label}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500 sm:text-xs">
                    {request.service_type} · {request.property_type || 'Property not specified'}
                  </p>
                  <p className="mt-3 line-clamp-3 text-[11px] leading-relaxed text-slate-600 sm:text-xs">
                    {request.latest_update?.message || 'Waiting for the next admin update.'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {selectedRequest && (
          <motion.div
            key={selectedRequest.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <RequestHeader selectedRequest={selectedRequest} />

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Project Inbox</h4>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500 sm:text-xs">
                    Only updates tied to your authenticated account appear here.
                  </p>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500 sm:px-3 sm:text-xs">
                  {selectedRequest.updates.length} updates
                </span>
              </div>

              <div className="mt-4 space-y-4 sm:mt-5">
                {selectedRequest.updates.map((update, index) => (
                  <div key={update.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={`mt-1 h-2.5 w-2.5 rounded-full ${updateMeta[update.type].dot}`} />
                      {index !== selectedRequest.updates.length - 1 && (
                        <span className="mt-2 h-full min-h-10 w-px bg-slate-200" />
                      )}
                    </div>
                    <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 sm:px-4 sm:py-3.5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${updateMeta[update.type].accent}`}>
                            {updateMeta[update.type].label}
                          </p>
                          <h5 className="mt-1 text-sm font-bold text-slate-900">{update.title}</h5>
                        </div>
                        <span className="text-[11px] text-slate-400 sm:text-xs">{formatTimestamp(update.created_at)}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{update.message}</p>
                      {update.actor_admin?.name && (
                        <p className="mt-2 text-xs font-medium text-slate-400">Posted by {update.actor_admin.name}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4 sm:p-5 md:p-6">
              <h4 className="text-base font-bold text-slate-900">Next Steps</h4>
              <div className="mt-3 grid gap-2.5 sm:gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-orange-200 bg-white/80 px-3.5 py-3 sm:px-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">Estimate</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">Review costing and scope once the admin uploads your quotation notes.</p>
                </div>
                <div className="rounded-xl border border-orange-200 bg-white/80 px-3.5 py-3 sm:px-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">Design Files</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">Concept directions and design updates stay tied to this request timeline.</p>
                </div>
                <div className="rounded-xl border border-orange-200 bg-white/80 px-3.5 py-3 sm:px-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">Schedule</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">Consultation and site-visit confirmations appear here and in your email inbox.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function RequestHeader({ selectedRequest }: { selectedRequest: InteriorRequestItem }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{selectedRequest.reference}</p>
          <h4 className="mt-1 text-lg font-bold leading-tight text-slate-900 sm:text-xl">{selectedRequest.project_type}</h4>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">{selectedRequest.service_type} for {selectedRequest.property_type || 'your property'}</p>
        </div>
        <span className={`rounded-full border px-2.5 py-1.5 text-[11px] font-semibold sm:px-3 sm:text-xs ${statusMeta[selectedRequest.status].pill}`}>
          {statusMeta[selectedRequest.status].label}
        </span>
      </div>

      <div className="mt-4 grid gap-2.5 sm:mt-5 sm:gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 sm:px-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Preferred Schedule</p>
          <p className="mt-1 text-sm font-semibold leading-snug text-slate-800">
            {formatDateTime(selectedRequest.preferred_date, selectedRequest.preferred_time)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 sm:px-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Assigned Admin</p>
          <p className="mt-1 text-sm font-semibold leading-snug text-slate-800">
            {selectedRequest.assigned_admin?.name || 'Unassigned'}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 sm:px-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Budget Range</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{selectedRequest.budget || 'Not provided'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 sm:px-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Target Timeline</p>
          <p className="mt-1 text-sm font-semibold leading-snug text-slate-800">{selectedRequest.target_timeline || 'To be discussed'}</p>
        </div>
      </div>
    </div>
  );
}
