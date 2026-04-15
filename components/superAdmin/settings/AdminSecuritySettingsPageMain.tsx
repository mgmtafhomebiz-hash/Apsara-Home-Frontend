'use client'

import { useState } from 'react'
import { showSuccessToast } from '@/libs/toast'

export default function AdminSecuritySettingsPageMain() {
  const [sessionTimeout, setSessionTimeout] = useState('30')
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5')
  const [passwordMinLength, setPasswordMinLength] = useState('8')
  const [enable2fa, setEnable2fa] = useState(false)

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 shadow-sm">
        <div className="pointer-events-none absolute -right-20 -top-16 h-48 w-48 rounded-full bg-cyan-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl" />
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-700">Settings</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Security Settings</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Adjust authentication limits, session safety, and password rules for the admin platform.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Session & Access</p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">Security Rules</h2>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Session Timeout (minutes)
            <input
              value={sessionTimeout}
              onChange={(event) => setSessionTimeout(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              placeholder="30"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Max Login Attempts
            <input
              value={maxLoginAttempts}
              onChange={(event) => setMaxLoginAttempts(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              placeholder="5"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Password Minimum Length
            <input
              value={passwordMinLength}
              onChange={(event) => setPasswordMinLength(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              placeholder="8"
            />
          </label>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">Enable 2FA</p>
              <p className="text-xs text-slate-500">Optional security layer for admin logins.</p>
            </div>
            <button
              type="button"
              onClick={() => setEnable2fa((prev) => !prev)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                enable2fa ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
              aria-pressed={enable2fa}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                  enable2fa ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => showSuccessToast('Security settings saved (UI only).')}
          className="rounded-full bg-gradient-to-r from-cyan-600 to-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}
