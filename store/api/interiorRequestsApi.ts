import { baseApi } from './baseApi'

export type InteriorRequestStatus =
  | 'pending'
  | 'reviewing'
  | 'estimate_ready'
  | 'scheduled'
  | 'completed'
  | 'cancelled'

export type InteriorRequestPriority = 'normal' | 'priority'
export type InteriorRequestUpdateType = 'message' | 'estimate' | 'design' | 'schedule'

export interface InteriorRequestActor {
  id: number
  name: string
  email: string
}

export interface InteriorRequestUpdate {
  id: number
  type: InteriorRequestUpdateType
  title: string
  message: string
  visible_to_customer: boolean
  payload?: Record<string, unknown> | null
  created_at: string | null
  actor_admin?: InteriorRequestActor | null
}

export interface InteriorRequestItem {
  id: number
  reference: string
  service_type: string
  project_type: string
  property_type: string
  project_scope: string
  budget: string
  style_preference: string
  preferred_date: string | null
  preferred_time: string
  flexibility: string
  target_timeline: string
  first_name: string
  last_name: string
  email: string
  phone: string
  notes: string
  referral: string
  inspiration_files: string[]
  status: InteriorRequestStatus
  priority: InteriorRequestPriority
  submitted_at: string | null
  updated_at: string | null
  latest_update?: {
    title: string
    message: string
    created_at: string | null
  } | null
  assigned_admin?: InteriorRequestActor | null
  customer?: InteriorRequestActor | null
  updates: InteriorRequestUpdate[]
}

export interface InteriorRequestCounts {
  all: number
  pending: number
  reviewing: number
  estimate_ready: number
  scheduled: number
  completed: number
}

export interface InteriorRequestsResponse {
  requests: InteriorRequestItem[]
  counts: InteriorRequestCounts
  generated_at: string
}

export interface InteriorRequestResponse {
  message?: string
  request: InteriorRequestItem
}

export interface CreateInteriorRequestPayload {
  service_type: string
  project_type: string
  property_type?: string
  project_scope?: string
  budget?: string
  style_preference?: string
  preferred_date: string
  preferred_time: string
  flexibility?: string
  target_timeline?: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  notes?: string
  referral?: string
  inspiration_files?: string[]
}

export interface AdminInteriorRequestUpdatePayload {
  status?: InteriorRequestStatus
  priority?: InteriorRequestPriority
  assign_to_me?: boolean
}

export interface AdminInteriorReplyPayload {
  type: InteriorRequestUpdateType
  title: string
  message: string
  visible_to_customer?: boolean
  status?: InteriorRequestStatus
  assign_to_me?: boolean
  payload?: Record<string, unknown>
}

export const interiorRequestsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createInteriorRequest: builder.mutation<InteriorRequestResponse, CreateInteriorRequestPayload>({
      query: (body) => ({
        url: '/api/interior-requests',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['InteriorRequests', 'CustomerNotifications', 'AdminNotifications'],
    }),
    getMyInteriorRequests: builder.query<InteriorRequestsResponse, void>({
      query: () => ({
        url: '/api/interior-requests',
        method: 'GET',
      }),
      providesTags: ['InteriorRequests'],
    }),
    getAdminInteriorRequests: builder.query<InteriorRequestsResponse, { status?: string; q?: string } | void>({
      query: (params) => ({
        url: '/api/admin/interior-requests',
        method: 'GET',
        params,
      }),
      providesTags: ['InteriorRequests', 'AdminNotifications'],
    }),
    updateAdminInteriorRequest: builder.mutation<InteriorRequestResponse, { id: number; body: AdminInteriorRequestUpdatePayload }>({
      query: ({ id, body }) => ({
        url: `/api/admin/interior-requests/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['InteriorRequests', 'CustomerNotifications'],
    }),
    replyAdminInteriorRequest: builder.mutation<InteriorRequestResponse, { id: number; body: AdminInteriorReplyPayload }>({
      query: ({ id, body }) => ({
        url: `/api/admin/interior-requests/${id}/updates`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['InteriorRequests', 'CustomerNotifications'],
    }),
  }),
})

export const {
  useCreateInteriorRequestMutation,
  useGetMyInteriorRequestsQuery,
  useGetAdminInteriorRequestsQuery,
  useUpdateAdminInteriorRequestMutation,
  useReplyAdminInteriorRequestMutation,
} = interiorRequestsApi
