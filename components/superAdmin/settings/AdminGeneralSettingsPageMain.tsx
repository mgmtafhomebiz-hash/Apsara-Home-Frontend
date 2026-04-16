'use client'

import { useEffect, useRef, useState } from 'react'
import { showErrorToast, showSuccessToast } from '@/libs/toast'
import {
  useGetAdminGeneralSettingsQuery,
  useUpdateAdminGeneralSettingsMutation,
} from '@/store/api/adminSettingsApi'

export default function AdminGeneralSettingsPageMain() {
  const { data, isFetching } = useGetAdminGeneralSettingsQuery()
  const [saveSettings, { isLoading: isSaving }] = useUpdateAdminGeneralSettingsMutation()
  const hasHydrated = useRef(false)
  const branchesTouched = useRef(false)

  const [systemName, setSystemName] = useState('Apsara Home')
  const [companyName, setCompanyName] = useState('')
  const [supportEmail, setSupportEmail] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [address, setAddress] = useState('')
  const [branches, setBranches] = useState<{ name: string; address: string; google_map_link?: string; waze_link?: string }[]>([])
  const [isBranchesModalOpen, setIsBranchesModalOpen] = useState(false)
  const [branchDraftName, setBranchDraftName] = useState('')
  const [branchDraftAddress, setBranchDraftAddress] = useState('')
  const [branchDraftGoogleMapLink, setBranchDraftGoogleMapLink] = useState('')
  const [branchDraftWazeLink, setBranchDraftWazeLink] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [faviconFile, setFaviconFile] = useState<File | null>(null)
  const [websiteQrCodeFile, setWebsiteQrCodeFile] = useState<File | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null)
  const [websiteQrCodeUrl, setWebsiteQrCodeUrl] = useState<string | null>(null)

  const [timezone, setTimezone] = useState('Asia/Manila')
  const [currency, setCurrency] = useState('PHP')
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY')
  const [language, setLanguage] = useState('English')
  const [enableTestPayments, setEnableTestPayments] = useState(false)

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!data?.settings || hasHydrated.current) return
    const settings = data.settings
    setSystemName(settings.system_name || 'Apsara Home')
    setCompanyName(settings.company_name || '')
    setSupportEmail(settings.support_email || '')
    setContactNumber(settings.contact_number || '')
    setAddress(settings.address || '')
    try {
      const parsed = settings.branches ? JSON.parse(settings.branches) : []
      if (!Array.isArray(parsed)) {
        if (!branchesTouched.current) setBranches([])
      } else {
        if (!branchesTouched.current) {
          setBranches(
            parsed
              .map((item) => ({
                name: typeof item?.name === 'string' ? item.name : '',
                address: typeof item?.address === 'string' ? item.address : '',
                google_map_link: typeof item?.google_map_link === 'string' ? item.google_map_link : '',
                waze_link: typeof item?.waze_link === 'string' ? item.waze_link : '',
              }))
              .filter((item) => item.name.trim() || item.address.trim()),
          )
        }
      }
    } catch {
      if (!branchesTouched.current) setBranches([])
    }
    setLogoUrl(settings.logo_url ?? null)
    setFaviconUrl(settings.favicon_url ?? null)
    setWebsiteQrCodeUrl(settings.website_qr_code_url ?? null)
    setTimezone(settings.timezone || 'Asia/Manila')
    setCurrency(settings.currency || 'PHP')
    setDateFormat(settings.date_format || 'MM/DD/YYYY')
    setLanguage(settings.language || 'English')
    setEnableTestPayments(Boolean(settings.enable_test_payments))
    hasHydrated.current = true
  }, [data])
  /* eslint-enable react-hooks/set-state-in-effect */

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

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 md:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Company Branches</p>
                <p className="text-sm text-slate-600">Add office name and address entries.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsBranchesModalOpen(true)}
                className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-cyan-700 shadow-sm ring-1 ring-cyan-100 transition hover:shadow-md"
              >
                Manage Branches
              </button>
            </div>
            {branches.length === 0 ? (
              <p className="text-sm text-slate-500">No branches added yet.</p>
            ) : (
              <ul className="space-y-2 text-sm text-slate-700">
                {branches.map((branch, index) => (
                  <li key={`${branch.name}-${index}`} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <p className="font-semibold text-slate-800">{branch.name}</p>
                    <p className="text-xs text-slate-500">{branch.address}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

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
            {logoUrl ? (
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-500">
                <img src={logoUrl} alt="Current logo" className="h-8 w-8 rounded-md object-contain" />
                <span>Current logo uploaded.</span>
              </div>
            ) : null}
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
            {faviconUrl ? (
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-500">
                <img src={faviconUrl} alt="Current favicon" className="h-8 w-8 rounded-md object-contain" />
                <span>Current favicon uploaded.</span>
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Upload Website QR Code</p>
            <p className="mt-1 text-sm text-slate-600">Shown on the website for customers to scan.</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-cyan-700 shadow-sm ring-1 ring-cyan-100 transition hover:shadow-md">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 16.5V5a2 2 0 012-2h6l2 2h6a2 2 0 012 2v9.5a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 16.5z" />
                  </svg>
                </span>
                Upload QR Code
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setWebsiteQrCodeFile(event.target.files?.[0] ?? null)}
                  className="sr-only"
                />
              </label>
              <span className="text-xs text-slate-500">{websiteQrCodeFile ? websiteQrCodeFile.name : 'No file selected'}</span>
            </div>
            {websiteQrCodeUrl ? (
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-500">
                <img src={websiteQrCodeUrl} alt="Current website QR code" className="h-16 w-16 rounded-md object-contain" />
                <span>Current QR code uploaded.</span>
              </div>
            ) : null}
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

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Checkout Payments</p>
            <h2 className="mt-2 text-lg font-bold text-slate-900">Test Payment Visibility</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              When enabled, customers on the live website can see the test/live payment mode switch during checkout.
            </p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase ${
            enableTestPayments
              ? 'border-amber-200 bg-amber-50 text-amber-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}>
            {enableTestPayments ? 'Test visible on checkout' : 'Live only'}
          </span>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-slate-800">Enable Test Payments on Customer Checkout</p>
              <p className="mt-1 text-sm text-slate-500">
                Recommended to keep this off in production unless you intentionally want customers to access PayMongo test mode.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={enableTestPayments}
              onClick={() => setEnableTestPayments((prev) => !prev)}
              className={`relative inline-flex h-8 w-15 shrink-0 items-center rounded-full border transition-all ${
                enableTestPayments
                  ? 'border-orange-300 bg-orange-500'
                  : 'border-slate-300 bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                  enableTestPayments ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={async () => {
            const payload = new FormData()
            payload.append('system_name', systemName)
            payload.append('company_name', companyName)
            payload.append('support_email', supportEmail)
            payload.append('contact_number', contactNumber)
            payload.append('address', address)
            payload.append('branches', JSON.stringify(branches))
            payload.append('timezone', timezone)
            payload.append('currency', currency)
            payload.append('date_format', dateFormat)
            payload.append('language', language)
            payload.append('enable_test_payments', enableTestPayments ? '1' : '0')

            if (logoFile) {
              payload.append('logo', logoFile)
            }
            if (faviconFile) {
              payload.append('favicon', faviconFile)
            }
            if (websiteQrCodeFile) {
              payload.append('website_qr_code', websiteQrCodeFile)
            }

            try {
              const response = await saveSettings(payload).unwrap()
              setLogoUrl(response.settings.logo_url ?? null)
              setFaviconUrl(response.settings.favicon_url ?? null)
              setWebsiteQrCodeUrl(response.settings.website_qr_code_url ?? null)
              setLogoFile(null)
              setFaviconFile(null)
              setWebsiteQrCodeFile(null)
              showSuccessToast(response.message || 'Settings saved.')
            } catch (error) {
              console.error(error)
              showErrorToast('Failed to save settings. Please try again.')
            }
          }}
          disabled={isSaving || isFetching}
          className="rounded-full bg-gradient-to-r from-cyan-600 to-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {isBranchesModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsBranchesModalOpen(false)} />
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Branches</p>
                <h3 className="mt-2 text-lg font-bold text-slate-900">Company Offices</h3>
                <p className="mt-1 text-sm text-slate-500">Add office name and address details.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsBranchesModalOpen(false)}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold text-slate-700">
                  Office Name
                  <input
                    value={branchDraftName}
                    onChange={(event) => setBranchDraftName(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                    placeholder="Main Office"
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-slate-700">
                  Office Address
                  <input
                    value={branchDraftAddress}
                    onChange={(event) => setBranchDraftAddress(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                    placeholder="123 Makati Ave, Metro Manila"
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-slate-700">
                  Google Map Link
                  <input
                    value={branchDraftGoogleMapLink}
                    onChange={(event) => setBranchDraftGoogleMapLink(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                    placeholder="https://maps.app.goo.gl/..."
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-slate-700">
                  Waze Link
                  <input
                    value={branchDraftWazeLink}
                    onChange={(event) => setBranchDraftWazeLink(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                    placeholder="https://waze.com/ul?..."
                  />
                </label>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!branchDraftName.trim() || !branchDraftAddress.trim()) {
                      showErrorToast('Please add both office name and address.')
                      return
                    }
                    setBranches((prev) => [
                      ...prev,
                      {
                        name: branchDraftName.trim(),
                        address: branchDraftAddress.trim(),
                        google_map_link: branchDraftGoogleMapLink.trim(),
                        waze_link: branchDraftWazeLink.trim(),
                      },
                    ])
                    branchesTouched.current = true
                    setBranchDraftName('')
                    setBranchDraftAddress('')
                    setBranchDraftGoogleMapLink('')
                    setBranchDraftWazeLink('')
                  }}
                  className="rounded-full bg-gradient-to-r from-cyan-600 to-sky-500 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:shadow-md"
                >
                  Add Branch
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {branches.length === 0 ? (
                <p className="text-sm text-slate-500">No branches added yet.</p>
              ) : (
                branches.map((branch, index) => (
                  <div
                    key={`${branch.name}-${index}`}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{branch.name}</p>
                      <p className="text-xs text-slate-500">{branch.address}</p>
                      {branch.google_map_link?.trim() ? (
                        <a
                          href={branch.google_map_link}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 block text-xs font-semibold text-cyan-700 hover:text-cyan-800"
                        >
                          Google Map
                        </a>
                      ) : null}
                      {branch.waze_link?.trim() ? (
                        <a
                          href={branch.waze_link}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 block text-xs font-semibold text-cyan-700 hover:text-cyan-800"
                        >
                          Waze
                        </a>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        branchesTouched.current = true
                        setBranches((prev) => prev.filter((_, idx) => idx !== index))
                      }}
                      className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-rose-600 shadow-sm ring-1 ring-rose-100"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
