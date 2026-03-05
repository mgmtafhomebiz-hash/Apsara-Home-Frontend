import { baseApi } from './baseApi'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export interface WishlistItem {
  wishlistId?: number
  productId: number
  name: string
  price: number
  image: string
  slug: string
}

type UnknownRow = Record<string, unknown>

const asObject = (value: unknown): UnknownRow => {
  if (value && typeof value === 'object') return value as UnknownRow
  return {}
}

const asNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}

const asString = (value: unknown): string => {
  return typeof value === 'string' ? value : ''
}

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')

const normalizeWishlistRow = (rowInput: unknown): WishlistItem | null => {
  const row = asObject(rowInput)
  const product = asObject(row.product ?? row.item ?? row.product_data ?? row)

  const productId =
    asNumber(product.id) ??
    asNumber(product.pd_id) ??
    asNumber(product.product_id) ??
    asNumber(row.cw_product_id) ??
    asNumber(row.product_id) ??
    null

  const name =
    asString(product.name) ||
    asString(product.pd_name) ||
    asString(row.name)

  if (!productId || !name) return null

  const price =
    asNumber(product.price) ??
    asNumber(product.priceDp) ??
    asNumber(product.pd_price_dp) ??
    asNumber(product.priceSrp) ??
    asNumber(product.pd_price_srp) ??
    0

  const image =
    asString(product.image) ||
    asString(product.pd_image) ||
    asString(row.image) ||
    '/Images/af_home_logo.png'

  const slug = asString(product.slug) || slugify(name)
  const wishlistId = asNumber(row.id) ?? undefined

  return {
    wishlistId,
    productId,
    name,
    price,
    image,
    slug,
  }
}

const normalizeWishlistResponse = (payload: unknown): WishlistItem[] => {
  const obj = asObject(payload)
  const rows =
    (Array.isArray(payload) ? payload : null) ??
    (Array.isArray(obj.data) ? obj.data : null) ??
    (Array.isArray(obj.items) ? obj.items : null) ??
    (Array.isArray(obj.wishlist) ? obj.wishlist : null) ??
    []

  return rows
    .map((row) => normalizeWishlistRow(row))
    .filter((row): row is WishlistItem => Boolean(row))
}

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<WishlistItem[], void>({
      async queryFn(_arg, _api, _extra, fetchWithBQ) {
        const candidates = ['/api/wishlist', '/api/customer/wishlist']

        for (const url of candidates) {
          const response = await fetchWithBQ({ url, method: 'GET' })
          if (!response.error) {
            return { data: normalizeWishlistResponse(response.data) }
          }

          const status = (response.error as FetchBaseQueryError).status
          if (status !== 404) {
            return { error: response.error }
          }
        }

        return {
          error: {
            status: 404,
            data: { message: 'Wishlist endpoint not found. Configure backend route first.' },
          } as FetchBaseQueryError,
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({ type: 'Wishlist' as const, id: item.productId })),
              { type: 'Wishlist' as const, id: 'LIST' },
            ]
          : [{ type: 'Wishlist' as const, id: 'LIST' }],
    }),
    addWishlist: builder.mutation<unknown, { product_id?: number; product_name?: string }>({
      async queryFn(body, _api, _extra, fetchWithBQ) {
        const candidates = ['/api/wishlist', '/api/customer/wishlist']

        for (const url of candidates) {
          const response = await fetchWithBQ({
            url,
            method: 'POST',
            body,
          })
          if (!response.error) return { data: response.data }

          const status = (response.error as FetchBaseQueryError).status
          if (status !== 404) return { error: response.error }
        }

        return {
          error: {
            status: 404,
            data: { message: 'Wishlist create endpoint not found.' },
          } as FetchBaseQueryError,
        }
      },
      invalidatesTags: [{ type: 'Wishlist', id: 'LIST' }],
    }),
    removeWishlist: builder.mutation<unknown, number>({
      async queryFn(productId, _api, _extra, fetchWithBQ) {
        const candidates = [
          `/api/wishlist/${productId}`,
          `/api/customer/wishlist/${productId}`,
        ]

        for (const url of candidates) {
          const response = await fetchWithBQ({
            url,
            method: 'DELETE',
          })
          if (!response.error) return { data: response.data }

          const status = (response.error as FetchBaseQueryError).status
          if (status !== 404) return { error: response.error }
        }

        return {
          error: {
            status: 404,
            data: { message: 'Wishlist delete endpoint not found.' },
          } as FetchBaseQueryError,
        }
      },
      invalidatesTags: (_result, _error, productId) => [
        { type: 'Wishlist', id: productId },
        { type: 'Wishlist', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetWishlistQuery,
  useAddWishlistMutation,
  useRemoveWishlistMutation,
} = wishlistApi
