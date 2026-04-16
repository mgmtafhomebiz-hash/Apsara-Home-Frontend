import { baseApi } from './baseApi'

export interface SearchHistoryItem {
  id: number
  query: string
  created_at: string
}

export interface SearchHistoryResponse {
  history: SearchHistoryItem[]
}

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    saveSearchHistory: builder.mutation<{ message: string }, { query: string }>({
      query: (body) => ({
        url: '/api/search/history',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SearchHistory'],
    }),

    getSearchHistory: builder.query<SearchHistoryResponse, void>({
      query: () => ({
        url: '/api/search/history',
        method: 'GET',
      }),
      providesTags: ['SearchHistory'],
    }),
  }),
  overrideExisting: true,
})

export const { useSaveSearchHistoryMutation, useGetSearchHistoryQuery } = searchApi
