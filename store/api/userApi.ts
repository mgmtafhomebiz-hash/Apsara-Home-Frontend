import { baseApi } from "./baseApi";

export interface MeResponse {
    id: number;
    name: string;
    email: string;
    username?: string;
    phone?: string;
    avatar_url?: string;
    account_status?: number;
    lock_status?: number;
    verification_status?: 'verified' | 'pending_review' | 'not_verified' | 'blocked';
}

export interface UpdateProfilePayload {
    name: string;
    username?: string;
    phone?: string;
    avatar_url?: string;
}

export const userApi = baseApi.injectEndpoints({
    endpoints:  (builder) => ({
        me: builder.query<MeResponse, void>({
            query: () => ({
                url: '/api/auth/me',
                method: 'GET'
            }),
            providesTags: ['User'],
        }),

        updateProfile: builder.mutation<MeResponse, UpdateProfilePayload>({
            query: (body) => ({
                url: '/api/auth/me',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['User'],
        })
    })
})

export const { useMeQuery, useUpdateProfileMutation } = userApi
