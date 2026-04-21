'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

type ResponseState = {
  status: 'idle' | 'loading' | 'success' | 'error'
  message: string
}

export default function MfaApprovalPage() {
  const searchParams = useSearchParams()
  const token = (searchParams.get('token') || '').trim()
  const decision = (searchParams.get('decision') || '').trim().toLowerCase()
  const apiBase = process.env.NEXT_PUBLIC_LARAVEL_API_URL

  const isValidDecision = decision === 'approve' || decision === 'deny'
  const title = useMemo(() => (decision === 'approve' ? 'Approve Sign-in' : 'Deny Sign-in'), [decision])

  const [result, setResult] = useState<ResponseState>({
    status: 'idle',
    message: '',
  })

  useEffect(() => {
    const run = async () => {
      if (!token || !isValidDecision) {
        setResult({
          status: 'error',
          message: 'Invalid approval link. Please request a new sign-in.',
        })
        return
      }
      if (!apiBase) {
        setResult({
          status: 'error',
          message: 'Server configuration missing. Please contact support.',
        })
        return
      }

      setResult({
        status: 'loading',
        message: 'Submitting your response...',
      })

      try {
        const res = await fetch(`${apiBase}/api/auth/login/mfa/respond`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            mfa_challenge_token: token,
            decision,
          }),
        })
        const data = await res.json().catch(() => null)
        if (!res.ok) {
          setResult({
            status: 'error',
            message: String(data?.message || 'Unable to process this request.'),
          })
          return
        }
        setResult({
          status: 'success',
          message: String(data?.message || 'Response received.'),
        })
      } catch {
        setResult({
          status: 'error',
          message: 'Network error. Please try opening the link again.',
        })
      }
    }

    run()
  }, [apiBase, decision, isValidDecision, token])

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">AF Home Security</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-3 text-sm text-slate-600">{result.message}</p>
        <div className="mt-6">
          <Link href="/login" className="inline-flex rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  )
}
