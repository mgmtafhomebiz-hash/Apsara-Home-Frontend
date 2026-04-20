import { baseApi } from './baseApi'

export interface ActivityLogPayload {
  customer_id: number
  activity_type: 'login' | 'logout' | 'purchase' | 'profile_update' | 'wallet_transaction' | 'encashment_request' | 'verification_request' | 'password_change' | 'username_change' | 'address_update' | 'payout_method_add' | 'payout_method_delete' | 'wishlist_update' | 'affiliate_voucher' | 'account_status_change'
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'view' | 'submit' | 'cancel'
  description?: string
  resource_type?: string | null
  resource_id?: number | null
  details?: Record<string, unknown>
  metadata?: Record<string, unknown>
  ip_address?: string
  user_agent?: string
}

export interface ActivityLog extends ActivityLogPayload {
  id: number
  created_at: string
  customer?: {
    id: number
    username: string
    email: string
    name: string
    phone?: string
    avatar_url?: string
    account_status: number
    lock_status: number
    created_at: string
  }
}

export interface ActivityLogsResponse {
  data: ActivityLog[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface ActivityLogsQueryParams {
  page?: number
  perPage?: number
  customer_id?: number
  activity_type?: string
  action?: string
  search?: string
}

export const activityLogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createActivityLog: builder.mutation<{ message: string; log: ActivityLog }, ActivityLogPayload>({
      query: (body) => ({
        url: '/api/admin/activity-logs',
        method: 'POST',
        body,
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        try {
          await queryFulfilled
          // Invalidate activity logs list to refresh data
          dispatch(activityLogsApi.util.invalidateTags(['ActivityLogs']))
        } catch {
          // Handle error silently to not interrupt user flow
        }
      },
    }),

    getActivityLogs: builder.query<ActivityLogsResponse, ActivityLogsQueryParams | void>({
      query: (params) => ({
        url: '/api/admin/activity-logs',
        method: 'GET',
        params: {
          page: params?.page ?? 1,
          per_page: params?.perPage ?? 50,
          customer_id: params?.customer_id,
          activity_type: params?.activity_type,
          action: params?.action,
          q: params?.search,
        },
      }),
      keepUnusedDataFor: 60,
      providesTags: ['ActivityLogs'],
    }),
  }),
})

export const {
  useCreateActivityLogMutation,
  useGetActivityLogsQuery,
  useLazyGetActivityLogsQuery,
} = activityLogsApi
