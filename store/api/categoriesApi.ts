import { baseApi } from './baseApi'

export interface Category {
  id: number
  name: string
  description: string
  url: string
  image: string | null
  order: number
}

export interface CategoriesResponse {
  categories: Category[]
  total: number
}

export interface GetCategoriesParams {
  search?: string
  page?: number
  per_page?: number
}

export interface CreateCategoryPayload {
  cat_name: string
  cat_description?: string
  cat_url?: string
  cat_order?: number
}

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesResponse, GetCategoriesParams | void>({
      query: (params) => ({
        url: '/api/admin/categories',
        method: 'GET',
        params: {
          q: params?.search,
          page: params?.page,
          per_page: params?.per_page,
        },
      }),
      providesTags: ['Categories'],
    }),
    createCategory: builder.mutation<{ message: string; category: Partial<Category> }, CreateCategoryPayload>({
      query: (body) => ({
        url: '/api/admin/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Categories'],
    }),
    updateCategory: builder.mutation<{ message: string }, { id: number; data: Partial<CreateCategoryPayload> }>({
      query: ({ id, data }) => ({
        url: `/api/admin/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Categories'],
    }),
    deleteCategory: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/api/admin/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Categories'],
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi
