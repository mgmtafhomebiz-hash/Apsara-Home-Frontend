'use client'

import { useEffect, useMemo, useState } from 'react'
import { useGetAddsContentPublicQuery } from '@/store/api/addsContentApi'

export default function AdsPopup() {
  const { data, isLoading, isError } = useGetAddsContentPublicQuery({ page: 'shop' })
  const activeItems = useMemo(() => {
    const items = (data?.items ?? []).filter(
      (item) => (item.status ?? 1) === 0 && (Boolean(item.image_url) || Boolean(item.video_url)),
    )
    const sorted = [...items].sort((a, b) => {
      const dateA = a.date_created ? new Date(`${a.date_created}T00:00:00`).getTime() : Number.NaN
      const dateB = b.date_created ? new Date(`${b.date_created}T00:00:00`).getTime() : Number.NaN
      if (Number.isFinite(dateA) && Number.isFinite(dateB) && dateA !== dateB) {
        return dateB - dateA
      }
      return (b.id ?? 0) - (a.id ?? 0)
    })
    return sorted.slice(0, 1)
  }, [data])

  const [isOpen, setIsOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [canClose, setCanClose] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (document.readyState === 'complete') {
      setIsReady(true)
      return
    }
    const handleReady = () => setIsReady(true)
    window.addEventListener('load', handleReady)
    return () => window.removeEventListener('load', handleReady)
  }, [])

  useEffect(() => {
    if (hasOpened) return
    if (!isReady) return
    if (isLoading || isError) return
    if (activeItems.length === 0) return
    const timer = window.setTimeout(() => {
      setActiveIndex(0)
      setIsOpen(true)
      setHasOpened(true)
      setCanClose(false)
    }, 350)
    return () => window.clearTimeout(timer)
  }, [activeItems.length, hasOpened, isReady, isLoading, isError])

  useEffect(() => {
    if (!isOpen) return
    const timer = window.setTimeout(() => {
      setCanClose(true)
    }, 10_000)
    return () => window.clearTimeout(timer)
  }, [isOpen])

  if (isLoading || isError || activeItems.length === 0 || !isOpen) return null

  const activeItem = activeItems[activeIndex]

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/65 px-4 py-6 backdrop-blur-md">
      <button
        type="button"
        onClick={() => {
          if (!canClose) return
          setIsOpen(false)
        }}
        className={`absolute inset-0 ${canClose ? 'cursor-pointer' : 'cursor-default'}`}
        aria-label="Close ads popup"
      />
      <div className="relative z-[71] flex w-full max-w-[96vw] items-center justify-center">
        <div className="relative">
          {canClose ? (
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#ECECEC] text-sm font-semibold text-slate-700 shadow-md transition hover:bg-white"
              aria-label="Close"
            >
              X
            </button>
          ) : null}
          {activeItem?.video_url ? (
            <video
              src={activeItem.video_url}
              autoPlay
              muted
              loop
              playsInline
              className="max-h-[78vh] w-auto max-w-[92vw] rounded-2xl bg-black object-contain shadow-2xl sm:max-h-[72vh] sm:max-w-[84vw] lg:max-h-[70vh] lg:max-w-[78vw]"
            />
          ) : (
            <img
              src={activeItem?.image_url ?? ''}
              alt="Sponsored content"
              className="max-h-[78vh] w-auto max-w-[92vw] rounded-2xl object-contain shadow-2xl sm:max-h-[72vh] sm:max-w-[84vw] lg:max-h-[70vh] lg:max-w-[78vw]"
            />
          )}
        </div>
      </div>
    </div>
  )
}
