import { baseApi } from './baseApi'

export type AdminNotificationSeverity = 'info' | 'warning' | 'critical' | 'success'

export interface AdminNotificationItem {
  id: string
  type?: string
  title: string
  description: string
  count: number
  is_read?: boolean
  severity: AdminNotificationSeverity
  href: string
  updated_at?: string | null
  payload?: Record<string, unknown> | null
}

export interface AdminNotificationsResponse {
  unread_count: number
  items: AdminNotificationItem[]
  generated_at: string
}

export const adminNotificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminNotifications: builder.query<AdminNotificationsResponse, void>({
      query: () => ({
        url: '/api/admin/orders/notifications',
        method: 'GET',
      }),
      providesTags: ['AdminNotifications'],
    }),
    markAdminNotificationRead: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/admin/orders/notifications/${id}/read`,
        method: 'POST',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          adminNotificationsApi.util.updateQueryData('getAdminNotifications', undefined, (draft) => {
            const target = draft.items.find((item) => item.id === id);
            if (!target || target.is_read) return;
            target.is_read = true;
            target.count = 0;
            draft.unread_count = Math.max(0, (draft.unread_count ?? 0) - 1);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['AdminNotifications'],
    }),
    markAllAdminNotificationsRead: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/api/admin/orders/notifications/read-all',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          adminNotificationsApi.util.updateQueryData('getAdminNotifications', undefined, (draft) => {
            draft.unread_count = 0;
            draft.items.forEach((item) => {
              item.is_read = true;
              item.count = 0;
            });
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['AdminNotifications'],
    }),
  }),
})

export const {
  useGetAdminNotificationsQuery,
  useMarkAdminNotificationReadMutation,
  useMarkAllAdminNotificationsReadMutation,
} = adminNotificationsApi
