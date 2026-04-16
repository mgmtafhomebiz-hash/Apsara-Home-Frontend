import { baseApi } from './baseApi'

export interface SearchHistoryItem {
  id: number
  query: string
  date_created: string
}

export interface SearchHistoryResponse {
  data: SearchHistoryItem[]
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

    clearSearchHistory: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/api/search/history',
        method: 'DELETE',
      }),
      invalidatesTags: ['SearchHistory'],
    }),
  }),
  overrideExisting: true,
})

export const { useSaveSearchHistoryMutation, useGetSearchHistoryQuery, useClearSearchHistoryMutation } = searchApi
