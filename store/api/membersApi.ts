import { Member } from '@/types/members/types'
import { MemberStatus, MemberTier } from '@/types/members/types'
import { baseApi } from './baseApi'

export interface MembersMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

export interface MembersResponse {
  members: Member[]
  meta: MembersMeta
}

interface MembersQueryParams {
  page?: number
  perPage?: number
  search?: string
  status?: MemberStatus
  tier?: MemberTier
}

export const membersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMembers: builder.query<MembersResponse, MembersQueryParams | void>({
      query: (params) => ({
        url: '/api/admin/members',
        method: 'GET',
        params: {
          page: params?.page ?? 1,
          per_page: params?.perPage ?? 25,
          q: params?.search,
          status: params?.status,
          tier: params?.tier,
        },
      }),
      providesTags: ['Members'],
    }),
  }),
})

export const { useGetMembersQuery } = membersApi
