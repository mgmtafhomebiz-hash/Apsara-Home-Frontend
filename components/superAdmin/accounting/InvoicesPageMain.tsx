'use client'

import { useEffect, useMemo, useState } from 'react'
import { AdminEncashmentItem, useGetAdminEncashmentRequestsQuery } from '@/store/api/encashmentApi'
import AdminPagination from '@/components/superAdmin/AdminPagination'

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 2,
  }).format(value || 0)

const formatDate = (value?: string | null) => {
  if (!value) return 'N/A'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return 'N/A'
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d)
}

const toDateKey = (value?: string | null) => {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const normalizeDateInput = (value?: string) => {
  if (!value) return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed

  const mmddyyyy = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!mmddyyyy) return undefined

  const [, mm, dd, yyyy] = mmddyyyy
  return `${yyyy}-${String(Number(mm)).padStart(2, '0')}-${String(Number(dd)).padStart(2, '0')}`
}

const sanitize = (value?: string | null) => {
  const text = value ?? ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const openPrintView = (row: AdminEncashmentItem) => {
  const win = window.open('', '_blank', 'width=900,height=700')
  if (!win) return

  const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice ${sanitize(row.invoice_no || row.reference_no)}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 32px; color: #0f172a; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 24px; }
    .title { font-size: 24px; font-weight: 700; }
    .muted { color:#64748b; font-size: 12px; }
    .box { border:1px solid #e2e8f0; border-radius:10px; padding:14px; margin-bottom: 14px; }
    .row { display:flex; justify-content:space-between; gap:16px; margin-bottom:8px; }
    .label { color:#475569; font-size:12px; text-transform: uppercase; letter-spacing: .04em; }
    .value { font-size:14px; font-weight:600; }
    .total { font-size: 22px; font-weight:700; color:#0f766e; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">AF Home Payout Invoice</div>
      <div class="muted">Auto-generated accounting document</div>
    </div>
    <div style="text-align:right">
      <div class="label">Invoice No</div>
      <div class="value">${sanitize(row.invoice_no || 'Pending')}</div>
    </div>
  </div>

  <div class="box">
    <div class="row"><div><div class="label">Encashment Ref</div><div class="value">${sanitize(row.reference_no)}</div></div><div><div class="label">Released At</div><div class="value">${sanitize(formatDate(row.released_at))}</div></div></div>
    <div class="row"><div><div class="label">Affiliate</div><div class="value">${sanitize(row.affiliate_name || 'Affiliate')}</div></div><div><div class="label">Email</div><div class="value">${sanitize(row.affiliate_email || '-')}</div></div></div>
    <div class="row"><div><div class="label">Channel</div><div class="value">${sanitize((row.channel || '').toUpperCase())}</div></div><div><div class="label">Account</div><div class="value">${sanitize(row.account_name || '-')} (${sanitize(row.account_number || '-')})</div></div></div>
  </div>

  <div class="box">
    <div class="label">Total Released Amount</div>
    <div class="total">${sanitize(formatMoney(row.amount))}</div>
  </div>

  <div class="muted">Generated ${sanitize(formatDate(new Date().toISOString()))}</div>
  <script>window.print();</script>
</body>
</html>
`

  win.document.open()
  win.document.write(html)
  win.document.close()
}

const openBulkPrintView = (rows: AdminEncashmentItem[]) => {
  if (!rows.length) return

  const win = window.open('', '_blank', 'width=1000,height=760')
  if (!win) return

  const invoices = rows.map((row) => `
    <section class="invoice">
      <div class="header">
        <div>
          <div class="title">AF Home Payout Invoice</div>
          <div class="muted">Auto-generated accounting document</div>
        </div>
        <div style="text-align:right">
          <div class="label">Invoice No</div>
          <div class="value">${sanitize(row.invoice_no || 'Pending')}</div>
        </div>
      </div>

      <div class="box">
        <div class="row"><div><div class="label">Encashment Ref</div><div class="value">${sanitize(row.reference_no)}</div></div><div><div class="label">Released At</div><div class="value">${sanitize(formatDate(row.released_at))}</div></div></div>
        <div class="row"><div><div class="label">Affiliate</div><div class="value">${sanitize(row.affiliate_name || 'Affiliate')}</div></div><div><div class="label">Email</div><div class="value">${sanitize(row.affiliate_email || '-')}</div></div></div>
        <div class="row"><div><div class="label">Channel</div><div class="value">${sanitize((row.channel || '').toUpperCase())}</div></div><div><div class="label">Account</div><div class="value">${sanitize(row.account_name || '-')} (${sanitize(row.account_number || '-')})</div></div></div>
      </div>

      <div class="box">
        <div class="label">Total Released Amount</div>
        <div class="total">${sanitize(formatMoney(row.amount))}</div>
      </div>
    </section>
  `).join('<div class="page-break"></div>')

  const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Bulk Invoices (${rows.length})</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; color: #0f172a; }
    .invoice { margin-bottom: 28px; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 18px; }
    .title { font-size: 22px; font-weight: 700; }
    .muted { color:#64748b; font-size: 12px; }
    .box { border:1px solid #e2e8f0; border-radius:10px; padding:12px; margin-bottom: 12px; }
    .row { display:flex; justify-content:space-between; gap:16px; margin-bottom:8px; }
    .label { color:#475569; font-size:11px; text-transform: uppercase; letter-spacing: .04em; }
    .value { font-size:13px; font-weight:600; }
    .total { font-size: 20px; font-weight:700; color:#0f766e; }
    .page-break { page-break-after: always; }
    .summary { margin-bottom: 16px; color:#334155; font-size:13px; }
  </style>
</head>
<body>
  <div class="summary">Generated ${sanitize(formatDate(new Date().toISOString()))} | Selected invoices: ${rows.length}</div>
  ${invoices}
  <script>window.print();</script>
</body>
</html>
`

  win.document.open()
  win.document.write(html)
  win.document.close()
}

export default function InvoicesPageMain() {
  const [search, setSearch] = useState('')
  const [releasedFrom, setReleasedFrom] = useState('')
  const [releasedTo, setReleasedTo] = useState('')
  const [page, setPage] = useState(1)
  const [selectedRow, setSelectedRow] = useState<AdminEncashmentItem | null>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const normalizedRange = useMemo(() => {
    const from = normalizeDateInput(releasedFrom)
    const to = normalizeDateInput(releasedTo)

    if (from && to && from > to) {
      return { from: to, to: from }
    }
    return { from, to }
  }, [releasedFrom, releasedTo])

  const { data, isLoading, isError, isFetching } = useGetAdminEncashmentRequestsQuery({
    filter: 'released',
    search: search.trim() || undefined,
    releasedFrom: normalizedRange.from,
    releasedTo: normalizedRange.to,
    page,
    perPage: 20,
  })

  const rows = data?.requests ?? []
  const displayRows = useMemo(() => {
    if (!normalizedRange.from && !normalizedRange.to) return rows
    return rows.filter((row) => {
      const releasedKey = toDateKey(row.released_at)
      if (!releasedKey) return false
      if (normalizedRange.from && releasedKey < normalizedRange.from) return false
      if (normalizedRange.to && releasedKey > normalizedRange.to) return false
      return true
    })
  }, [rows, normalizedRange.from, normalizedRange.to])

  const totalReleased = useMemo(() => displayRows.reduce((sum, row) => sum + row.amount, 0), [displayRows])
  const selectedRows = useMemo(() => displayRows.filter((row) => selectedIds.includes(row.id)), [displayRows, selectedIds])
  const allSelectedOnPage = displayRows.length > 0 && displayRows.every((row) => selectedIds.includes(row.id))

  useEffect(() => {
    const rowIdSet = new Set(displayRows.map((row) => row.id))
    setSelectedIds((prev) => prev.filter((id) => rowIdSet.has(id)))
  }, [displayRows])

  const toggleRow = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleSelectAllOnPage = () => {
    if (allSelectedOnPage) {
      setSelectedIds([])
      return
    }
    setSelectedIds(displayRows.map((row) => row.id))
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Invoices</h1>
        <p className="text-sm text-slate-500 mt-0.5">Issued payout invoices from released encashment requests.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-start">
          <div className="space-y-3">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search invoice, reference, affiliate..."
              className="w-full rounded-[18px] border border-gray-300 px-3 py-2 text-sm text-slate-800 outline-none transition-all focus:border-sky-400 dark:border-white/18 dark:bg-white/12 dark:text-slate-200 dark:focus:border-sky-400/60"
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
              <label className="text-xs text-slate-500">
                From
                <input
                  type="date"
                  value={releasedFrom}
                  onChange={(e) => {
                    setReleasedFrom(e.target.value)
                    setPage(1)
                  }}
                  className="mt-1 w-full rounded-[18px] border border-gray-300 px-3 py-2 text-sm text-slate-800 outline-none transition-all focus:border-sky-400 dark:border-white/18 dark:bg-white/12 dark:text-slate-200 dark:focus:border-sky-400/60"
                />
              </label>

              <label className="text-xs text-slate-500">
                To
                <input
                  type="date"
                  value={releasedTo}
                  onChange={(e) => {
                    setReleasedTo(e.target.value)
                    setPage(1)
                  }}
                  className="mt-1 w-full rounded-[18px] border border-gray-300 px-3 py-2 text-sm text-slate-800 outline-none transition-all focus:border-sky-400 dark:border-white/18 dark:bg-white/12 dark:text-slate-200 dark:focus:border-sky-400/60"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  setReleasedFrom('')
                  setReleasedTo('')
                  setSearch('')
                  setPage(1)
                }}
                className="h-[40px] rounded-[18px] border border-gray-300 px-4 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 dark:border-white/18 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="min-w-[240px] rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Total Released (Current Page)</p>
            <p className="mt-1 text-xl font-bold text-slate-800">{formatMoney(totalReleased)}</p>
            <button
              type="button"
              onClick={() => openBulkPrintView(selectedRows)}
              disabled={selectedRows.length === 0}
            className="mt-3 w-full rounded-[18px] border border-teal-200 px-3 py-2 text-xs font-semibold text-teal-700 transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-teal-900/30 dark:bg-teal-500/10 dark:text-teal-300"
            >
              Print Selected ({selectedRows.length})
            </button>
          </div>
        </div>
      </div>

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Failed to load invoices data.
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 animate-pulse dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-slate-100" />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {isFetching ? <div className="google-loading-bar" /> : null}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-slate-50 border-b border-slate-200 dark:border-slate-800 dark:bg-slate-800/40">
                  <tr className="text-left text-xs text-slate-500">
                    <th className="px-4 py-3 font-semibold">
                      <input
                        type="checkbox"
                        checked={allSelectedOnPage}
                        onChange={toggleSelectAllOnPage}
                        aria-label="Select all invoices on this page"
                      />
                    </th>
                    <th className="px-4 py-3 font-semibold">Invoice</th>
                    <th className="px-4 py-3 font-semibold">Encashment Ref</th>
                    <th className="px-4 py-3 font-semibold">Affiliate</th>
                    <th className="px-4 py-3 font-semibold">Amount</th>
                    <th className="px-4 py-3 font-semibold">Channel</th>
                    <th className="px-4 py-3 font-semibold">Released At</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayRows.length ? (
                    displayRows.map((row) => (
                      <tr key={row.id} className="border-b border-slate-50 last:border-b-0 text-sm dark:border-slate-800">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(row.id)}
                            onChange={() => toggleRow(row.id)}
                            aria-label={`Select invoice ${row.invoice_no || row.reference_no}`}
                          />
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{row.invoice_no || 'Pending'}</td>
                        <td className="px-4 py-3 text-slate-700">{row.reference_no}</td>
                        <td className="px-4 py-3">
                          <p className="text-slate-800">{row.affiliate_name || 'Affiliate'}</p>
                          <p className="text-xs text-slate-500">{row.affiliate_email || '-'}</p>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800">{formatMoney(row.amount)}</td>
                        <td className="px-4 py-3 uppercase text-slate-600">{row.channel}</td>
                        <td className="px-4 py-3 text-slate-500">{formatDate(row.released_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedRow(row)}
                              className="rounded-[18px] border border-gray-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-white/18 dark:text-slate-200 dark:hover:bg-white/10"
                            >
                              View
                            </button>
                            <button
                              onClick={() => openPrintView(row)}
                              className="rounded-[18px] border border-teal-200 px-2.5 py-1.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-50 dark:border-teal-900/30 dark:bg-teal-500/10 dark:text-teal-300"
                            >
                              Print
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-500">
                        No invoice records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <AdminPagination
            currentPage={data?.meta?.current_page ?? 1}
            totalPages={data?.meta?.last_page ?? 1}
            from={data?.meta?.from}
            to={data?.meta?.to}
            totalRecords={data?.meta?.total ?? 0}
            onPageChange={setPage}
          />
        </div>
      )}

      {selectedRow ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-800">Invoice Details</h2>
                <p className="text-xs text-slate-500 mt-0.5">{selectedRow.invoice_no || selectedRow.reference_no}</p>
              </div>
              <button
                onClick={() => setSelectedRow(null)}
                className="rounded-[18px] border border-gray-300 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 dark:border-white/18 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 px-5 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Invoice No</p>
                  <p className="mt-1 font-semibold text-slate-800">{selectedRow.invoice_no || 'Pending'}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Encashment Ref</p>
                  <p className="mt-1 font-semibold text-slate-800">{selectedRow.reference_no}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Affiliate</p>
                  <p className="mt-1 text-slate-800">{selectedRow.affiliate_name || 'Affiliate'}</p>
                  <p className="text-slate-500">{selectedRow.affiliate_email || '-'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Payout Details</p>
                  <p className="mt-1 text-slate-800 uppercase">{selectedRow.channel}</p>
                  <p className="text-slate-500">{selectedRow.account_name || '-'}</p>
                  <p className="text-slate-500">{selectedRow.account_number || '-'}</p>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 dark:border-emerald-900/30 dark:bg-emerald-500/10">
                <p className="text-xs uppercase tracking-wide text-emerald-700">Released Amount</p>
                <p className="mt-1 text-2xl font-bold text-emerald-800">{formatMoney(selectedRow.amount)}</p>
                <p className="text-xs text-emerald-700">Released at {formatDate(selectedRow.released_at)}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3 dark:border-slate-800">
              <button
                onClick={() => openPrintView(selectedRow)}
                className="rounded-[18px] border border-teal-200 px-3 py-2 text-xs font-semibold text-teal-700 transition hover:bg-teal-50 dark:border-teal-900/30 dark:bg-teal-500/10 dark:text-teal-300"
              >
                Download / Print
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
