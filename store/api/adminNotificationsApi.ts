import { baseApi } from './baseApi'

export type AdminNotificationSeverity = 'info' | 'warning' | 'critical' | 'success'

export interface AdminNotificationItem {
  id: string
  title: string
  description: string
  count: number
  severity: AdminNotificationSeverity
  href: string
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
  }),
})

export const { useGetAdminNotificationsQuery } = adminNotificationsApi
