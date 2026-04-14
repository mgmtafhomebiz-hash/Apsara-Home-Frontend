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
  }),
})

export const {
  useGetPublicGeneralSettingsQuery,
  useGetAdminGeneralSettingsQuery,
  useUpdateAdminGeneralSettingsMutation,
} = adminSettingsApi
