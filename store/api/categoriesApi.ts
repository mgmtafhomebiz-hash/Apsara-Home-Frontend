import { baseApi } from './baseApi'

export interface Category {
  id: number
  name: string
  description: string
  url: string
  image: string | null
  order: number
  product_count?: number
}

export interface CategoriesResponse {
  categories: Category[]
  total: number
}

export interface GetCategoriesParams {
  search?: string
  page?: number
  per_page?: number
  supplier_id?: number
  used_only?: boolean
}

export interface CreateCategoryPayload {
  cat_name: string
  cat_description?: string
  cat_url?: string
  cat_order?: number
}

const normalizeCategoryText = (value: string) => {
  const trimmed = (value ?? '').trim()
  if (!trimmed) return ''
  if (trimmed.includes('Ã') || trimmed.includes('Â')) {
    try {
      const decoded = decodeURIComponent(escape(trimmed))
      if (decoded) return decoded
    } catch {
      return trimmed
    }
  }
  return trimmed
}

const normalizeCategoriesResponse = (response: CategoriesResponse): CategoriesResponse => ({
  ...response,
  categories: (response.categories ?? []).map((category) => ({
    ...category,
    name: normalizeCategoryText(category.name),
    description: normalizeCategoryText(category.description),
  })),
})

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesResponse, GetCategoriesParams | void>({
      query: (params) => ({
        url: '/api/categories',
        method: 'GET',
        params: {
          q: params?.search,
          page: params?.page,
          per_page: params?.per_page,
          supplier_id: params?.supplier_id,
          used_only: params?.used_only,
        },
      }),
      transformResponse: (response: CategoriesResponse) => normalizeCategoriesResponse(response),
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
