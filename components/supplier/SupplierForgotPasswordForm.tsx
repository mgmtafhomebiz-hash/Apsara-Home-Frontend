'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function SupplierForgotPasswordForm() {
  const apiUrl = (process.env.NEXT_PUBLIC_LARAVEL_API_URL ?? '').replace(/\/+$/, '')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!apiUrl) {
      setError('API URL is not configured.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`${apiUrl}/api/supplier/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data?.message || 'Unable to send reset email.')
      }

      setSuccess(data?.message || 'If that email exists, a reset link has been sent.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send reset email.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/30">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              Supplier Password Reset
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white">Forgot your supplier password?</h1>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Enter the email linked to your supplier account and we will send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Supplier Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                {success}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Sending reset link...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            <Link href="/supplier/login" className="font-semibold text-cyan-300 underline">
              Back to supplier login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
