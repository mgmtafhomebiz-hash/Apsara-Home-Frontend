import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getSession } from "next-auth/react";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_LARAVEL_API_URL,
    credentials: 'include',
    prepareHeaders: async (headers) => {
        let accessToken: string | undefined

        if (typeof window !== 'undefined') {
            accessToken = window.localStorage.getItem('accessToken') ?? undefined
        }

        if (!accessToken) {
            const session = await getSession()
            const user = session?.user as { accessToken?: string } | undefined
            accessToken = user?.accessToken
        }

        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`)
        }

        headers.set('Accept', 'application/json')
        headers.set('Content-Type', 'application/json')
        return headers
    }
})

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery,
    tagTypes: ['User', 'Members'],
    endpoints: () => ({}),
})
