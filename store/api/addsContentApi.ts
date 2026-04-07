import { baseApi } from './baseApi'

export interface AddsContentItem {
  id: number
  image_url?: string | null
  video_url?: string | null
  date_created?: string | null
  created_at?: string | null
}

export const addsContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAddsContent: builder.mutation<{ message: string; item: AddsContentItem }, FormData>({
      query: (body) => ({
        url: '/api/admin/webpages/adds-content',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const { useCreateAddsContentMutation } = addsContentApi
