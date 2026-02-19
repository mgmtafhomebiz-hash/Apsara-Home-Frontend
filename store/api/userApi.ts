import { baseApi } from "./baseApi";

export interface MeResponse {
    id: number;
    name: string;
    email: string;
    username?: string;
    phone?: string
}

export const userApi = baseApi.injectEndpoints({
    endpoints:  (builder) => ({
        me: builder.query<MeResponse, void>({
            query: () => ({
                url: '/api/auth/me',
                method: 'GET'
            }),
            providesTags: ['User'],
        })
    })
})

export const { useMeQuery } = userApi