import { baseApi } from './baseApi'

export interface SupplierItem {
  id: number
  name: string
  company: string
  email: string
  contact: string
  address: string
  status: number
}

export interface CreateSupplierPayload {
  name: string
  company: string
  email?: string
  contact?: string
  address?: string
  status?: number
}

export interface InviteSupplierUserPayload {
  supplier_id: number
  fullname: string
  username: string
  email: string
  level_type?: number
}

export const suppliersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuppliers: builder.query<{ suppliers: SupplierItem[] }, void>({
      query: () => ({
        url: '/api/admin/suppliers',
        method: 'GET',
      }),
      providesTags: ['Suppliers'],
    }),
    createSupplier: builder.mutation<{ message: string; supplier: SupplierItem }, CreateSupplierPayload>({
      query: (body) => ({
        url: '/api/admin/suppliers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Suppliers'],
    }),
    updateSupplier: builder.mutation<{ message: string; supplier: SupplierItem }, { id: number; data: CreateSupplierPayload }>({
      query: ({ id, data }) => ({
        url: `/api/admin/suppliers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Suppliers'],
    }),
    deleteSupplier: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/api/admin/suppliers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Suppliers'],
    }),
    inviteSupplierUser: builder.mutation<{ message: string }, InviteSupplierUserPayload>({
      query: (body) => ({
        url: '/api/admin/supplier-users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Suppliers'],
    }),
  }),
})

export const {
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useInviteSupplierUserMutation,
} = suppliersApi
