import { baseApi } from './baseApi'

export interface Product {
  id: number
  name: string
  catid: number
  catsubid: number
  priceSrp: number
  priceDp: number
  qty: number
  weight: number
  type: number
  musthave: boolean
  bestseller: boolean
  salespromo: boolean
  status: number
  sku: string
  image: string | null
  createdAt: string | null
  updatedAt: string | null
}

export interface ProductsMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

export interface ProductsResponse {
  products: Product[]
  meta: ProductsMeta
}

export interface CreateProductPayload {
  pd_name: string
  pd_catid: number
  pd_catsubid?: number
  pd_price_srp: number
  pd_price_dp?: number
  pd_qty?: number
  pd_weight?: number
  pd_psweight?: number
  pd_pslenght?: number
  pd_psheight?: number
  pd_description?: string
  pd_parent_sku?: string
  pd_type?: number
  pd_musthave?: boolean
  pd_bestseller?: boolean
  pd_salespromo?: boolean
  pd_status?: number
  pd_image?: string
}

interface ProductsQueryParams {
  page?: number
  perPage?: number
  search?: string
  status?: string
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductsQueryParams | void>({
      query: (params) => ({
        url: '/api/admin/products',
        method: 'GET',
        params: {
          page: params?.page ?? 1,
          per_page: params?.perPage ?? 25,
          q: params?.search,
          status: params?.status,
        },
      }),
      providesTags: ['Products'],
    }),
    createProduct: builder.mutation<{ message: string; product: Partial<Product> }, CreateProductPayload>({
      query: (body) => ({
        url: '/api/admin/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation<{ message: string }, { id: number; data: Partial<CreateProductPayload> }>({
      query: ({ id, data }) => ({
        url: `/api/admin/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    deleteProduct: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/api/admin/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi
