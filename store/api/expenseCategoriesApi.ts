import { baseApi } from './baseApi'

export interface ExpenseCategory {
  id: number
  name: string
  description: string
  status: number
  created_at?: string | null
  updated_at?: string | null
}

interface ExpenseCategoriesResponse {
  categories: ExpenseCategory[]
  total: number
}

interface ExpenseCategoryPayload {
  name: string
  description?: string
  status?: number
}

export const expenseCategoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExpenseCategories: builder.query<ExpenseCategoriesResponse, { search?: string } | void>({
      query: (params) => ({
        url: '/api/admin/expenses/categories',
        method: 'GET',
        params: {
          q: params?.search,
        },
      }),
      providesTags: ['ExpenseCategories'],
    }),
    createExpenseCategory: builder.mutation<{ message: string; category: ExpenseCategory }, ExpenseCategoryPayload>({
      query: (body) => ({
        url: '/api/admin/expenses/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ExpenseCategories'],
    }),
    updateExpenseCategory: builder.mutation<
      { message: string; category: ExpenseCategory },
      { id: number; data: ExpenseCategoryPayload }
    >({
      query: ({ id, data }) => ({
        url: `/api/admin/expenses/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['ExpenseCategories'],
    }),
    deleteExpenseCategory: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/api/admin/expenses/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ExpenseCategories'],
    }),
  }),
})

export const {
  useGetExpenseCategoriesQuery,
  useCreateExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation,
  useDeleteExpenseCategoryMutation,
} = expenseCategoriesApi

