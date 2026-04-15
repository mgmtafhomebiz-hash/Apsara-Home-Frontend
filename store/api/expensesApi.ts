import { baseApi } from './baseApi'

export interface ExpenseCategoryRef {
  id: number
  name: string
  status: number
}

export interface Expense {
  id: number
  category: ExpenseCategoryRef
  category_id: number
  amount: number
  intent: string
  transaction_date: string
  status: number
  created_by_admin_id?: number | null
  created_at?: string | null
  updated_at?: string | null
}

interface ExpensesResponse {
  expenses: Expense[]
  total: number
}

export interface ExpensesSummaryResponse {
  count: number
  total_amount: number
  from: string | null
  to: string | null
}

export interface GetExpensesParams {
  search?: string
  dateFrom?: string
  dateTo?: string
}

export interface ExpensePayload {
  category_id: number
  amount: number
  intent: string
  transaction_date: string
  status?: number
}

export const expensesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<ExpensesResponse, GetExpensesParams | void>({
      query: (params) => ({
        url: '/api/admin/expenses',
        method: 'GET',
        params: {
          q: params?.search,
          date_from: params?.dateFrom,
          date_to: params?.dateTo,
        },
      }),
      providesTags: ['Expenses'],
    }),
    createExpense: builder.mutation<{ message: string; expense: Expense }, ExpensePayload>({
      query: (body) => ({
        url: '/api/admin/expenses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Expenses'],
    }),
    updateExpense: builder.mutation<{ message: string; expense: Expense }, { id: number; data: ExpensePayload }>({
      query: ({ id, data }) => ({
        url: `/api/admin/expenses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Expenses'],
    }),
    deleteExpense: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/api/admin/expenses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Expenses'],
    }),
    getExpensesSummary: builder.query<ExpensesSummaryResponse, { from?: string; to?: string; status?: number } | void>({
      query: (params) => ({
        url: '/api/admin/expenses/summary',
        method: 'GET',
        params: {
          from: params?.from,
          to: params?.to,
          status: params?.status,
        },
      }),
      providesTags: ['Expenses'],
    }),
  }),
})

export const {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetExpensesSummaryQuery,
} = expensesApi
