'use client';

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ResetPayload = {
  email: string
  name: string
  expires_at: string
}

type Props = {
  token: string
}

function getPasswordChecks(password: string) {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }
}

export default function ResetPasswordForm({ token }: Props) {
  const apiUrl = (process.env.NEXT_PUBLIC_LARAVEL_API_URL ?? '').replace(/\/+$/, '')
  const [reset, setReset] = useState<ResetPayload | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const checks = useMemo(() => getPasswordChecks(password), [password])

  const getFirstApiError = (value: unknown): string | null => {
    if (!value || typeof value !== 'object') return null

    const errorMap = value as Record<string, unknown>
    const firstEntry = Object.values(errorMap)[0]

    if (Array.isArray(firstEntry) && typeof firstEntry[0] === 'string') {
      return firstEntry[0]
    }

    return null
  }

  useEffect(() => {
    let isMounted = true

    const loadReset = async () => {
      if (!apiUrl || !token) {
        if (isMounted) {
          setError('Reset link is invalid.')
          setIsLoading(false)
        }
        return
      }

      try {
        const res = await fetch(`${apiUrl}/api/auth/reset-password/${encodeURIComponent(token)}`, {
          cache: 'no-store',
          headers: {
            Accept: 'application/json',
          },
        })

        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(data?.message || 'Reset link is invalid or expired.')
        }

        if (isMounted) {
          setReset(data.reset)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load reset link.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadReset()

    return () => {
      isMounted = false
    }
  }, [apiUrl, token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!Object.values(checks).every(Boolean)) {
      setError('Password does not meet the required strength.')
      return
    }

    if (!apiUrl) {
      setError('API URL is not configured.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
          password_confirmation: confirmPassword,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const firstError = getFirstApiError((data as { errors?: unknown } | null)?.errors)
        throw new Error(firstError || data?.message || 'Unable to reset password.')
      }

      setSuccess(data?.message || 'Your password has been reset.')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden overflow-y-auto flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-800/85 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="mt-2 text-sm text-white/70">
            Choose a new password for your AF Home account.
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
            Loading reset details...
          </div>
        ) : error && !reset ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 shadow-sm dark:border-red-400/20 dark:bg-red-500/20 dark:text-red-300">
            {error}
          </div>
        ) : reset ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              <p><span className="font-semibold text-white">Name:</span> {reset.name}</p>
              <p className="mt-1"><span className="font-semibold text-white">Email:</span> {reset.email}</p>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-white">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create your new password"
                className="w-full rounded-xl border border-white/25 bg-white/15 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400/60"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-white">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="w-full rounded-xl border border-white/25 bg-white/15 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-orange-400/60"
              />
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white">Password requirements</p>
              <ul className="mt-2 space-y-1 text-sm text-white/70">
                <li className={checks.length ? 'text-emerald-300' : ''}>At least 8 characters</li>
                <li className={checks.uppercase ? 'text-emerald-300' : ''}>At least one uppercase letter</li>
                <li className={checks.lowercase ? 'text-emerald-300' : ''}>At least one lowercase letter</li>
                <li className={checks.number ? 'text-emerald-300' : ''}>At least one number</li>
                <li className={checks.special ? 'text-emerald-300' : ''}>At least one special character</li>
              </ul>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 shadow-sm dark:border-red-400/20 dark:bg-red-500/20 dark:text-red-300">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/20 px-4 py-2.5 text-sm text-emerald-200">
                {success} <Link href="/login" className="font-semibold underline">Go to login</Link>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-orange-500 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Resetting password...' : 'Reset Password'}
            </button>
          </form>
        ) : null}

        <p className="mt-6 text-center text-sm text-white/70">
          <Link href="/login" className="font-semibold text-orange-400 hover:text-orange-300">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
