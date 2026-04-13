'use client'

import { useState } from 'react'
import { showSuccessToast } from '@/libs/toast'

export default function AdminGeneralSettingsPageMain() {
  const [systemName, setSystemName] = useState('Apsara Home')
  const [companyName, setCompanyName] = useState('')
  const [supportEmail, setSupportEmail] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [address, setAddress] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [faviconFile, setFaviconFile] = useState<File | null>(null)

  const [timezone, setTimezone] = useState('Asia/Manila')
  const [currency, setCurrency] = useState('PHP')
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY')
  const [language, setLanguage] = useState('English')

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 shadow-sm">
        <div className="pointer-events-none absolute -right-24 -top-20 h-48 w-48 rounded-full bg-cyan-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-amber-200/40 blur-3xl" />
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-700">Settings</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">General Settings</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Configure system identity details and localization defaults for your admin experience.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">System Information</p>
            <h2 className="mt-2 text-lg font-bold text-slate-900">Brand & Contact</h2>
          </div>
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase text-amber-700">Top priority</span>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            System Name
            <input
              value={systemName}
              onChange={(event) => setSystemName(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              placeholder="Apsara Home"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Company Name
            <input
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              placeholder="Company name"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Support Email
            <input
              type="email"
              value={supportEmail}
              onChange={(event) => setSupportEmail(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              placeholder="support@company.com"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Contact Number
            <input
              value={contactNumber}
              onChange={(event) => setContactNumber(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              placeholder="+63"
            />
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
            Address
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              placeholder="Company address"
            />
          </label>

          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Upload Logo</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-cyan-700 shadow-sm ring-1 ring-cyan-100 transition hover:shadow-md">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 16.5V5a2 2 0 012-2h6l2 2h6a2 2 0 012 2v9.5a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 16.5z" />
                  </svg>
                </span>
                Upload Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setLogoFile(event.target.files?.[0] ?? null)}
                  className="sr-only"
                />
              </label>
              <span className="text-xs text-slate-500">{logoFile ? logoFile.name : 'No file selected'}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Upload Favicon</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-cyan-700 shadow-sm ring-1 ring-cyan-100 transition hover:shadow-md">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 16.5V5a2 2 0 012-2h6l2 2h6a2 2 0 012 2v9.5a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 16.5z" />
                  </svg>
                </span>
                Upload Favicon
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setFaviconFile(event.target.files?.[0] ?? null)}
                  className="sr-only"
                />
              </label>
              <span className="text-xs text-slate-500">{faviconFile ? faviconFile.name : 'No file selected'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Localization</p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">PH-based defaults</h2>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Timezone
            <select
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            >
              <option value="Asia/Manila">Asia/Manila</option>
              <option value="Asia/Shanghai">Asia/Shanghai</option>
              <option value="UTC">UTC</option>
            </select>
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Currency
            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            >
              <option value="PHP">PHP (₱)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Date Format
            <select
              value={dateFormat}
              onChange={(event) => setDateFormat(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-700">
            Language
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            >
              <option value="English">English</option>
              <option value="Filipino">Filipino</option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            showSuccessToast('Settings saved (MVP).')
          }}
          className="rounded-full bg-gradient-to-r from-cyan-600 to-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}
