import { baseApi } from './baseApi'

interface RegisterPayload {
  name: string
  first_name: string
  last_name: string
  email: string
  password: string
  password_confirmation: string
  username: string
  referred_by: string
}

interface RegisterResponse {
  message: string
  requires_otp: boolean
  verification_token: string
  email: string
}

interface VerifyRegisterOtpPayload {
  verification_token: string
  otp: string
}

interface VerifyRegisterOtpResponse {
  message: string
}

interface ResendRegisterOtpPayload {
  verification_token: string
}

interface ResendRegisterOtpResponse {
  message: string
}

interface UsernameAvailabilityResponse {
  available: boolean
  message: string
}

interface LogoutResponse {
  message: string
}

interface AdminLoginPayload {
  login: string;
  password: string;

}

interface AdminLoginResponse {
  message?: string;
  token: string;
  role?: string;
  user_level_id?: number;
  user?: {
    id?: number;
    role?: string;
    user_level_id?: number;
    email?: string
    admin_permissions?: string[]
    avatar_url?: string
    supplier_id?: number | null
  }
}

export interface AdminMeResponse {
  id: number
  name: string
  email: string
  role: string
  user_level_id: number
  supplier_id?: number | null
  admin_permissions?: string[]
  storefront_ids?: number[]
  avatar_url?: string
}

interface UpdateAdminMePayload {
  name?: string
  avatar_url?: string | null
}

interface UpdateAdminMeResponse {
  message: string
  profile: AdminMeResponse
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterPayload>({
      query: (body) => ({
        url: '/api/auth/register',
        method: 'POST',
        body,
      }),
    }),

    verifyRegisterOtp: builder.mutation<VerifyRegisterOtpResponse, VerifyRegisterOtpPayload>({
      query: (body) => ({
        url: '/api/auth/register/verify-otp',
        method: 'POST',
        body,
      }),
    }),

    resendRegisterOtp: builder.mutation<ResendRegisterOtpResponse, ResendRegisterOtpPayload>({
      query: (body) => ({
        url: '/api/auth/register/resend-otp',
        method: 'POST',
        body,
      }),
    }),

    checkUsernameAvailability: builder.query<UsernameAvailabilityResponse, string>({
      query: (username) => ({
        url: '/api/auth/register/check-username',
        method: 'GET',
        params: { username },
      }),
    }),

    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    adminLogin: builder.mutation<AdminLoginResponse, AdminLoginPayload>({
        query: (body) => ({
          url: '/api/admin/auth/login',
          method: 'POST',
          body,
        })
    }),
    getAdminMe: builder.query<AdminMeResponse, string | void>({
      query: () => ({
        url: '/api/admin/auth/me',
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
      providesTags: ['AdminUsers'],
    }),
    updateAdminMe: builder.mutation<UpdateAdminMeResponse, UpdateAdminMePayload>({
      query: (body) => ({
        url: '/api/admin/auth/me',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['AdminUsers'],
    }),
  }),
})

export const {
  useRegisterMutation,
  useVerifyRegisterOtpMutation,
  useResendRegisterOtpMutation,
  useLazyCheckUsernameAvailabilityQuery,
  useLogoutMutation,
  useAdminLoginMutation,
  useGetAdminMeQuery,
  useUpdateAdminMeMutation,
} = authApi
