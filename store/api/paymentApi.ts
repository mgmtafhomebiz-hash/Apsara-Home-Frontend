import { baseApi } from './baseApi'

export type CheckoutPaymentMethod = 'online_banking' | 'card' | 'gcash' | 'maya'

export interface CheckoutCustomerPayload {
  name?: string
  email?: string
  phone?: string
  address?: string
}

export interface CreateCheckoutSessionPayload {
  amount: number
  description: string
  payment_method: CheckoutPaymentMethod
  customer?: CheckoutCustomerPayload
}

export interface CreateCheckoutSessionResponse {
  checkout_id: string | null
  checkout_url: string | null
}

export interface VerifyCheckoutSessionResponse {
  checkout_id: string
  status: string | null
  payment_intent_id: string | null
  raw?: Record<string, unknown>
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation<CreateCheckoutSessionResponse, CreateCheckoutSessionPayload>({
      query: (body) => ({
        url: '/api/payments/checkout-session',
        method: 'POST',
        body,
      }),
    }),
    verifyCheckoutSession: builder.query<VerifyCheckoutSessionResponse, string>({
      query: (checkoutId) => ({
        url: `/api/payments/checkout-session/${checkoutId}`,
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useCreateCheckoutSessionMutation,
  useLazyVerifyCheckoutSessionQuery,
} = paymentApi
