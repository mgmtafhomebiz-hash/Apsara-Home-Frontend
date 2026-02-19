import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getSession } from "next-auth/react";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_LARAVEL_API_URL, 
    prepareHeaders: async (headers) => {
        const session = await getSession()
        if ((session?.user as any)?.accessToken) {
            headers.set('Authorization', `Bearer ${(session?.user as any).accessToken}`)
        }
        headers.set('Accept', 'application/json')
        headers.set('Content-Type', 'application/json')
        return headers
    }
})

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery,
    tagTypes: ['User'],
    endpoints: () => ({}),
})