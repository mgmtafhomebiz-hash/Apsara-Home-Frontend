import { baseApi } from './baseApi'

export interface AdminUserItem {
  id: number
  name: string
  username: string
  email: string
  role: string
  user_level_id: number
  supplier_id?: number | null
  supplier_name?: string | null
  admin_permissions?: string[]
  storefront_ids?: number[]
  is_banned?: boolean
  is_online?: boolean
  last_seen_at?: string | null
  minutes_since_active?: number | null
  last_active_path?: string | null
}

export interface AdminUsersResponse {
  users: AdminUserItem[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
  }
}

interface AdminUsersQuery {
  search?: string
  role?: string
  activityStatus?: 'active' | 'inactive'
  page?: number
  perPage?: number
}

export interface AdminUserActivityLog {
  id: number
  action: string
  status: string
  productName: string
  productSku?: string | null
  createdAt?: string | null
}

export interface AdminUserActivityResponse {
  user: AdminUserItem
  logs: AdminUserActivityLog[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
  }
}

export interface CreateAdminUserPayload {
  name: string
  username: string
  email?: string
  user_level_id: number
  supplier_id?: number | null
  admin_permissions?: string[]
  storefront_ids?: number[]
}

export interface CreateAdminUserResponse {
  message: string
  setup_url: string
  delivery: 'link_only' | 'email_and_link'
  invite: {
    name: string
    username: string
    email: string
    role: string
    role_label?: string
    expires_at: string
    admin_permissions?: string[]
  }
}

export interface UpdateAdminUserPayload {
  id: number
  name?: string
  username?: string
  email?: string
  password?: string
  user_level_id?: number
  supplier_id?: number | null
  admin_permissions?: string[]
  storefront_ids?: number[]
}

export const adminUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query<AdminUsersResponse, AdminUsersQuery | void>({
      query: (params) => ({
        url: '/api/admin/users',
        method: 'GET',
        params: {
          q: params?.search,
          role: params?.role,
          activity_status: params?.activityStatus,
          page: params?.page ?? 1,
          per_page: params?.perPage ?? 20,
        },
      }),
      providesTags: ['AdminUsers'],
    }),
    getAdminUserActivity: builder.query<AdminUserActivityResponse, { id: number; page?: number; perPage?: number }>({
      query: ({ id, page = 1, perPage = 12 }) => ({
        url: `/api/admin/users/${id}/activity`,
        method: 'GET',
        params: {
          page,
          per_page: perPage,
        },
      }),
      providesTags: ['AdminUsers'],
    }),
    heartbeatAdminPresence: builder.mutation<{ message: string; last_seen_at?: string; last_active_path?: string | null }, { path?: string | null } | void>({
      query: (body) => ({
        url: '/api/admin/users/presence/heartbeat',
        method: 'POST',
        body: {
          path: body?.path ?? null,
        },
      }),
    }),
    createAdminUser: builder.mutation<CreateAdminUserResponse, CreateAdminUserPayload>({
      query: (body) => ({
        url: '/api/admin/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AdminUsers'],
    }),
    updateAdminUser: builder.mutation<{ message: string; user: AdminUserItem }, UpdateAdminUserPayload>({
      query: ({ id, ...body }) => ({
        url: `/api/admin/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['AdminUsers'],
    }),
    deleteAdminUser: builder.mutation<{ message: string }, { id: number }>({
      query: ({ id }) => ({
        url: `/api/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminUsers'],
    }),
    banAdminUser: builder.mutation<{ message: string; user: AdminUserItem }, { id: number }>({
      query: ({ id }) => ({
        url: `/api/admin/users/${id}/ban`,
        method: 'PUT',
      }),
      invalidatesTags: ['AdminUsers'],
    }),
    unbanAdminUser: builder.mutation<{ message: string; user: AdminUserItem }, { id: number }>({
      query: ({ id }) => ({
        url: `/api/admin/users/${id}/unban`,
        method: 'PUT',
      }),
      invalidatesTags: ['AdminUsers'],
    }),
  }),
})

export const {
  useGetAdminUsersQuery,
  useGetAdminUserActivityQuery,
  useHeartbeatAdminPresenceMutation,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
  useBanAdminUserMutation,
  useUnbanAdminUserMutation,
} = adminUsersApi
