'use client';

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordForm() {
  const apiUrl = (process.env.NEXT_PUBLIC_LARAVEL_API_URL ?? '').replace(/\/+$/, '')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!apiUrl) {
      setError('API URL is not configured.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`${apiUrl}/api/auth/forgot-password`, {
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
    <div className="relative min-h-screen w-full overflow-x-hidden overflow-y-auto flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-800/85 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
          <p className="mt-2 text-sm text-white/70">
            Enter your AF Home account email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-white">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-xl border border-white/25 bg-white/15 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400/60"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 shadow-sm dark:border-red-400/20 dark:bg-red-500/20 dark:text-red-300">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/20 px-4 py-2.5 text-sm text-emerald-200">
              {success}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Sending reset link...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/70">
          <Link href="/login" className="font-semibold text-orange-400 hover:text-orange-300">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
