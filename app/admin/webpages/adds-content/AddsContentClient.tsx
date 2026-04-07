'use client'

import { useMemo, useState } from 'react'
import { showErrorToast, showSuccessToast } from '@/libs/toast'
import { useCreateAddsContentMutation } from '@/store/api/addsContentApi'

export default function AddsContentClient() {
  const [isOpen, setIsOpen] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [dateCreated, setDateCreated] = useState('')
  const [isDateOpen, setIsDateOpen] = useState(false)
  const [createAddsContent, { isLoading }] = useCreateAddsContentMutation()

  const monthLabels = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  const weekdayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const selectedDate = useMemo(() => {
    if (!dateCreated) return undefined
    const parsed = new Date(`${dateCreated}T00:00:00`)
    return Number.isNaN(parsed.getTime()) ? undefined : parsed
  }, [dateCreated])

  const [visibleMonth, setVisibleMonth] = useState(() => {
    const base = selectedDate ?? new Date()
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  const monthMatrix = useMemo(() => {
    const start = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1)
    const end = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0)
    const daysInMonth = end.getDate()
    const startDay = start.getDay()
    const cells: Array<{ date: Date | null; isCurrentMonth: boolean }> = []

    for (let i = 0; i < startDay; i += 1) {
      cells.push({ date: null, isCurrentMonth: false })
    }
    for (let d = 1; d <= daysInMonth; d += 1) {
      cells.push({
        date: new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), d),
        isCurrentMonth: true,
      })
    }
    while (cells.length % 7 !== 0) {
      cells.push({ date: null, isCurrentMonth: false })
    }

    const weeks = []
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7))
    }
    return weeks
  }, [visibleMonth])

  const displayDate = useMemo(() => {
    if (!selectedDate) return 'Select date'
    return new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }).format(selectedDate)
  }, [selectedDate])

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Web Content</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Adds Content</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
          This page will manage advertising placements, promos, and sponsored content blocks once connected to the
          web content service.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-orange-100/70 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-amber-100/70 blur-3xl animate-pulse" />

        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-600">Campaign Builder</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">Add New Content</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              Create advertising placements, promo tiles, and sponsored content blocks with a single action.
              You can later attach images, links, and scheduling windows.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 5v14m-7-7h14" />
              </svg>
            </span>
            Add Content
            <span className="inline-flex h-2 w-2 rounded-full bg-white/90 animate-ping" />
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-amber-200 hover:text-amber-700"
          >
            View Drafts
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          <div className="relative z-[61] w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-600">New Campaign</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">Add Content Details</h3>
                <p className="mt-1 text-sm text-slate-500">Fill in image, video, and schedule details.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-amber-200 hover:text-amber-700"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Image</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-amber-700 shadow-sm ring-1 ring-amber-100 transition hover:shadow-md">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 16.5V5a2 2 0 012-2h6l2 2h6a2 2 0 012 2v9.5a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 16.5z" />
                      </svg>
                    </span>
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                      className="sr-only"
                    />
                  </label>
                  <span className="text-xs text-slate-500">
                    {imageFile ? imageFile.name : 'No file selected'}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Video</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-amber-700 shadow-sm ring-1 ring-amber-100 transition hover:shadow-md">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 6h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
                      </svg>
                    </span>
                    Upload Video
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(event) => setVideoFile(event.target.files?.[0] ?? null)}
                      className="sr-only"
                    />
                  </label>
                  <span className="text-xs text-slate-500">
                    {videoFile ? videoFile.name : 'No file selected'}
                  </span>
                </div>
              </div>

              <div className="relative sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600">Date Created</label>
                <button
                  type="button"
                  onClick={() => setIsDateOpen((v) => !v)}
                  className="mt-2 flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 transition hover:border-amber-200"
                >
                  <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className={selectedDate ? 'text-slate-800' : 'text-slate-400'}>{displayDate}</span>
                  </div>
                  <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <p className="mt-1 text-[11px] text-slate-500">Pick the date this content should be recorded.</p>

                {isDateOpen && (
                  <div className="absolute z-[70] bottom-full mb-2 w-[320px] max-h-[320px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex items-center justify-between px-1">
                      <button
                        type="button"
                        onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}
                        className="h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:border-amber-200 hover:text-amber-600"
                      >
                        ‹
                      </button>
                      <div className="text-sm font-semibold text-slate-800">
                        {monthLabels[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
                      </div>
                      <button
                        type="button"
                        onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}
                        className="h-8 w-8 rounded-lg border border-slate-200 text-slate-500 hover:border-amber-200 hover:text-amber-600"
                      >
                        ›
                      </button>
                    </div>

                    <div className="mt-3 grid grid-cols-7 text-center text-[11px] font-semibold uppercase text-slate-400">
                      {weekdayLabels.map((label) => (
                        <span key={label}>{label}</span>
                      ))}
                    </div>
                    <div className="mt-2 grid grid-cols-7 gap-y-1 text-center text-sm">
                      {monthMatrix.map((week, wi) => (
                        <div key={`week-${wi}`} className="contents">
                          {week.map((cell, di) => {
                            const isSelected =
                              cell.date &&
                              selectedDate &&
                              cell.date.toDateString() === selectedDate.toDateString()
                            const isToday = cell.date && cell.date.toDateString() === new Date().toDateString()
                            return (
                              <button
                                type="button"
                                key={`day-${wi}-${di}`}
                                disabled={!cell.date}
                                onClick={() => {
                                  if (!cell.date) return
                                  setDateCreated(cell.date.toISOString().slice(0, 10))
                                  setIsDateOpen(false)
                                }}
                                className={`mx-auto flex h-9 w-9 items-center justify-center rounded-lg transition ${
                                  !cell.date
                                    ? 'opacity-0'
                                    : isSelected
                                      ? 'bg-amber-500 text-white'
                                      : isToday
                                        ? 'border border-amber-200 text-amber-700 hover:bg-amber-50'
                                        : 'text-slate-700 hover:bg-amber-50 hover:text-amber-700'
                                }`}
                              >
                                {cell.date?.getDate()}
                              </button>
                            )
                          })}
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setDateCreated('')
                          setIsDateOpen(false)
                        }}
                        className="text-slate-500 hover:text-amber-600"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const today = new Date()
                          setDateCreated(today.toISOString().slice(0, 10))
                          setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1))
                          setIsDateOpen(false)
                        }}
                        className="font-semibold text-amber-600 hover:text-amber-700"
                      >
                        Today
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-amber-200 hover:text-amber-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const formData = new FormData()
                  if (imageFile) formData.append('image', imageFile)
                  if (videoFile) formData.append('video', videoFile)
                  if (dateCreated) formData.append('date_created', dateCreated)

                  if (!imageFile && !videoFile) {
                    showErrorToast('Please upload an image or a video.')
                    return
                  }

                  try {
                    const response = await createAddsContent(formData).unwrap()
                    showSuccessToast(response.message || 'Content saved.')
                    setIsOpen(false)
                    setImageFile(null)
                    setVideoFile(null)
                    setDateCreated('')
                  } catch (error: any) {
                    showErrorToast(error?.data?.message || 'Failed to save content.')
                  }
                }}
                disabled={isLoading}
                className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:opacity-60"
              >
                {isLoading ? 'Saving...' : 'Save Content'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
