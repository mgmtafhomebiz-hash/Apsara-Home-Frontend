'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type InvitePayload = {
  name: string
  username: string
  email: string
  role: string
  expires_at: string
  status?: 'pending' | 'accepted' | 'expired'
  accepted_at?: string | null
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

export default function AdminInviteSetupForm({ token }: Props) {
  const apiUrl = (process.env.NEXT_PUBLIC_LARAVEL_API_URL ?? '').replace(/\/+$/, '')
  const [invite, setInvite] = useState<InvitePayload | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [inviteState, setInviteState] = useState<'pending' | 'accepted' | 'expired' | 'invalid'>('pending')

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

    const loadInvite = async () => {
      if (!apiUrl || !token) {
        if (isMounted) {
          setError('Invite link is invalid.')
          setIsLoading(false)
        }
        return
      }

      try {
        const res = await fetch(`${apiUrl}/api/admin/invites/${encodeURIComponent(token)}`, {
          cache: 'no-store',
          headers: {
            Accept: 'application/json',
          },
        })

        const data = await res.json().catch(() => ({}))

        if (!res.ok) {
          if (isMounted) {
            setInviteState(data?.status === 'expired' ? 'expired' : 'invalid')
            if (data?.invite) {
              setInvite(data.invite)
            }
          }
          throw new Error(data?.message || 'Invite link is invalid or expired.')
        }

        if (isMounted) {
          setInvite(data.invite)
          setInviteState(data?.status === 'accepted' ? 'accepted' : 'pending')
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load invite.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadInvite()

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
      const res = await fetch(`${apiUrl}/api/admin/invites/accept`, {
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
        throw new Error(firstError || data?.message || 'Unable to complete admin setup.')
      }

      setSuccess(data?.message || 'Admin account activated successfully.')
      setInviteState('accepted')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to complete admin setup.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const title =
    inviteState === 'accepted'
      ? 'Admin account already activated'
      : inviteState === 'expired'
        ? 'Admin invite expired'
        : inviteState === 'invalid'
          ? 'Admin invite unavailable'
          : 'Finish your admin account setup'

  const subtitle =
    inviteState === 'accepted'
      ? 'This setup link has already been used successfully. You can proceed to the admin portal and sign in.'
      : inviteState === 'expired'
        ? 'This invitation is no longer valid because it has passed the 24-hour setup window.'
        : inviteState === 'invalid'
          ? 'This invitation link is not available anymore. Please request a fresh admin invite.'
          : 'Verify this invitation by setting your password. After that, you can sign in to the admin portal.'

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/30">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">
              Admin Setup
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              {subtitle}
            </p>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-5 py-6 text-sm text-slate-400">
              Loading invite details...
            </div>
          ) : error && !invite ? (
            <div className={`rounded-2xl px-5 py-6 text-sm ${inviteState === 'expired' ? 'border border-amber-500/20 bg-amber-500/10 text-amber-200' : 'border border-red-500/20 bg-red-500/10 text-red-300'}`}>
              {error}
              <div className="mt-4">
                <Link href="/admin/login" className="font-semibold underline">
                  Go to admin login
                </Link>
              </div>
            </div>
          ) : invite ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Full Name</p>
                  <p className="mt-1 text-sm font-medium text-white">{invite.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Role</p>
                  <p className="mt-1 text-sm font-medium capitalize text-white">{invite.role.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Username</p>
                  <p className="mt-1 text-sm font-medium text-white">{invite.username}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                  <p className="mt-1 text-sm font-medium text-white">{invite.email || 'Not provided'}</p>
                </div>
              </div>

              {success || inviteState === 'accepted' ? (
                <div className="space-y-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {success ? 'Account activated successfully' : 'This account is already activated'}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-emerald-100/90">
                        {success
                          ? `${invite.name}'s admin account is now ready. You can continue to the admin portal and sign in using your new password.`
                          : `${invite.name}'s admin account was already activated before. You can continue to the admin portal and sign in.`}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/admin/login"
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-teal-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-400"
                  >
                    Login to Your Account
                  </Link>
                </div>
              ) : inviteState === 'expired' ? (
                <div className="space-y-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 3c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">This invite has expired</p>
                      <p className="mt-2 text-sm leading-6 text-amber-100/90">
                        The 24-hour activation window has already passed for this admin setup link. Please request a fresh invitation from your admin manager.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Link
                      href="/admin/login"
                      className="inline-flex items-center justify-center rounded-2xl border border-amber-400/30 bg-white/5 px-4 py-3 text-sm font-semibold text-amber-100 transition hover:bg-white/10"
                    >
                      Go to Admin Login
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-200">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create your password"
                          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 pr-20 text-sm text-white placeholder:text-slate-500 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 transition hover:text-white"
                        >
                          {showPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-200">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm your password"
                          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 pr-20 text-sm text-white placeholder:text-slate-500 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 transition hover:text-white"
                        >
                          {showConfirmPassword ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
                    <p className="text-sm font-semibold text-white">Password strength</p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <div className={`rounded-xl border px-3 py-2 text-sm ${checks.length ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-900/70 text-slate-400'}`}>
                        8+ characters
                      </div>
                      <div className={`rounded-xl border px-3 py-2 text-sm ${checks.uppercase ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-900/70 text-slate-400'}`}>
                        Uppercase letter
                      </div>
                      <div className={`rounded-xl border px-3 py-2 text-sm ${checks.lowercase ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-900/70 text-slate-400'}`}>
                        Lowercase letter
                      </div>
                      <div className={`rounded-xl border px-3 py-2 text-sm ${checks.number ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-900/70 text-slate-400'}`}>
                        Number
                      </div>
                      <div className={`rounded-xl border px-3 py-2 text-sm sm:col-span-2 ${checks.special ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-900/70 text-slate-400'}`}>
                        Special character
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-2xl bg-teal-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? 'Activating account...' : 'Activate Admin Account'}
                  </button>
                </>
              )}
            </form>
          ) : null}
        </div>
      </div>
    </div>
  )
}
