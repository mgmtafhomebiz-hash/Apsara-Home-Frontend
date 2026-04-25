import { baseApi } from './baseApi'

export interface ShippingRate {
  id: number
  province: string
  city: string
  provinceKey: string
  cityKey: string
  fee: number
  status: boolean
  updatedAt?: string | null
}

export interface ShippingRatesResponse {
  rates: ShippingRate[]
}

export interface ShippingRatePayload {
  province: string
  city: string
  fee: number
  status?: boolean
}

export const shippingRatesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicShippingRates: builder.query<ShippingRatesResponse, void>({
      query: () => ({
        url: '/api/shipping-rates',
        method: 'GET',
        cache: 'no-store',
      }),
      providesTags: ['ShippingRates'],
    }),
    getAdminShippingRates: builder.query<ShippingRatesResponse, void>({
      query: () => ({
        url: '/api/admin/shipping/rates',
        method: 'GET',
        cache: 'no-store',
      }),
      providesTags: ['ShippingRates'],
    }),
    createAdminShippingRate: builder.mutation<{ message: string; rate: ShippingRate }, ShippingRatePayload>({
      query: (body) => ({
        url: '/api/admin/shipping/rates',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ShippingRates'],
    }),
    updateAdminShippingRate: builder.mutation<{ message: string; rate: ShippingRate }, ShippingRatePayload & { id: number }>({
      query: ({ id, ...body }) => ({
        url: `/api/admin/shipping/rates/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['ShippingRates'],
    }),
    deleteAdminShippingRate: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/api/admin/shipping/rates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ShippingRates'],
    }),
    bulkDeleteAdminShippingRates: builder.mutation<{ message: string; deleted_count: number }, number[]>({
      query: (ids) => ({
        url: '/api/admin/shipping/rates',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: ['ShippingRates'],
    }),
  }),
})

export const {
  useGetPublicShippingRatesQuery,
  useGetAdminShippingRatesQuery,
  useCreateAdminShippingRateMutation,
  useUpdateAdminShippingRateMutation,
  useDeleteAdminShippingRateMutation,
  useBulkDeleteAdminShippingRatesMutation,
} = shippingRatesApi
