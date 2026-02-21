import { baseApi } from './baseApi'

interface RegisterPayload {
  name: string
  first_name: string
  last_name: string
  middle_name?: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  username: string
  referred_by?: string
  birth_date?: string
}

interface RegisterResponse {
  message: string
}

interface LogoutResponse {
  message: string
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

    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const { useRegisterMutation, useLogoutMutation } = authApi
