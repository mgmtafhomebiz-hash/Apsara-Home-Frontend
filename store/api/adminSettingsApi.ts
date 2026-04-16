import { baseApi } from './baseApi'

export interface AdminGeneralSettings {
  system_name: string
  company_name: string
  support_email: string
  contact_number: string
  address: string
  branches: string
  logo_url: string | null
  favicon_url: string | null
  timezone: string
  currency: string
  date_format: string
  language: string
  enable_test_payments: boolean
  enable_manual_checkout_mode: boolean
  updated_at?: string | null
}

export interface AdminSecuritySettings {
  session_timeout_minutes: number
  max_login_attempts: number
  password_min_length: number
  enable_2fa: boolean
  updated_at?: string | null
}

export interface AdminNotificationSettings {
  email_notifications: boolean
  sms_notifications: boolean
  admin_alerts: boolean
  updated_at?: string | null
}

export const adminSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicGeneralSettings: builder.query<{ settings: AdminGeneralSettings }, void>({
      query: () => ({
        url: '/api/settings/general',
        method: 'GET',
        cache: 'no-store',
      }),
      providesTags: ['AdminSettings'],
    }),
    getAdminGeneralSettings: builder.query<{ settings: AdminGeneralSettings }, void>({
      query: () => ({
        url: '/api/admin/settings/general',
        method: 'GET',
        cache: 'no-store',
      }),
      providesTags: ['AdminSettings'],
    }),
    updateAdminGeneralSettings: builder.mutation<
      { message: string; settings: AdminGeneralSettings },
      FormData
    >({
      query: (body) => ({
        url: '/api/admin/settings/general',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AdminSettings'],
    }),
    getAdminSecuritySettings: builder.query<{ settings: AdminSecuritySettings }, void>({
      query: () => ({
        url: '/api/admin/settings/security',
        method: 'GET',
        cache: 'no-store',
      }),
      providesTags: ['AdminSettings'],
    }),
    updateAdminSecuritySettings: builder.mutation<
      { message: string; settings: AdminSecuritySettings },
      AdminSecuritySettings
    >({
      query: (body) => ({
        url: '/api/admin/settings/security',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AdminSettings'],
    }),
    getAdminNotificationSettings: builder.query<{ settings: AdminNotificationSettings }, void>({
      query: () => ({
        url: '/api/admin/settings/notifications',
        method: 'GET',
        cache: 'no-store',
      }),
      providesTags: ['AdminSettings'],
    }),
    updateAdminNotificationSettings: builder.mutation<
      { message: string; settings: AdminNotificationSettings },
      AdminNotificationSettings
    >({
      query: (body) => ({
        url: '/api/admin/settings/notifications',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AdminSettings'],
    }),
  }),
})

export const {
  useGetPublicGeneralSettingsQuery,
  useGetAdminGeneralSettingsQuery,
  useUpdateAdminGeneralSettingsMutation,
  useGetAdminSecuritySettingsQuery,
  useUpdateAdminSecuritySettingsMutation,
  useGetAdminNotificationSettingsQuery,
  useUpdateAdminNotificationSettingsMutation,
} = adminSettingsApi
