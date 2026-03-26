'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'

type Props = {
  isOpen: boolean
  imageSrc: string | null
  fileName?: string
  onClose: () => void
  onSave: (file: File) => Promise<void> | void
}

type LoadedImage = {
  width: number
  height: number
  element: HTMLImageElement
}

const FRAME_SIZE = 320
const EXPORT_SIZE = 1200

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

async function loadImage(src: string): Promise<LoadedImage> {
  return await new Promise((resolve, reject) => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight, element: img })
    img.onerror = () => reject(new Error('Unable to load image for editing.'))
    img.src = src
  })
}

export default function ImagePositionEditorModal({ isOpen, imageSrc, fileName, onClose, onSave }: Props) {
  const [loadedImage, setLoadedImage] = useState<LoadedImage | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const dragRef = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null)

  useEffect(() => {
    if (!isOpen || !imageSrc) {
      setLoadedImage(null)
      setOffset({ x: 0, y: 0 })
      setZoom(1)
      setError('')
      return
    }

    let active = true
    setError('')
    setLoadedImage(null)
    setOffset({ x: 0, y: 0 })
    setZoom(1)

    void loadImage(imageSrc)
      .then((image) => {
        if (!active) return
        setLoadedImage(image)
      })
      .catch((err) => {
        if (!active) return
        setError((err as Error).message || 'Unable to load image.')
      })

    return () => {
      active = false
    }
  }, [imageSrc, isOpen])

  const coverMetrics = useMemo(() => {
    if (!loadedImage) return null

    const baseScale = Math.max(FRAME_SIZE / loadedImage.width, FRAME_SIZE / loadedImage.height)
    const renderedWidth = loadedImage.width * baseScale * zoom
    const renderedHeight = loadedImage.height * baseScale * zoom
    const maxX = Math.max(0, (renderedWidth - FRAME_SIZE) / 2)
    const maxY = Math.max(0, (renderedHeight - FRAME_SIZE) / 2)

    return { baseScale, renderedWidth, renderedHeight, maxX, maxY }
  }, [loadedImage, zoom])

  useEffect(() => {
    if (!coverMetrics) return

    setOffset((prev) => ({
      x: clamp(prev.x, -coverMetrics.maxX, coverMetrics.maxX),
      y: clamp(prev.y, -coverMetrics.maxY, coverMetrics.maxY),
    }))
  }, [coverMetrics])

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!coverMetrics) return
    dragRef.current = {
      x: offset.x,
      y: offset.y,
      startX: event.clientX,
      startY: event.clientY,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || !coverMetrics) return

    const deltaX = event.clientX - dragRef.current.startX
    const deltaY = event.clientY - dragRef.current.startY

    setOffset({
      x: clamp(dragRef.current.x + deltaX, -coverMetrics.maxX, coverMetrics.maxX),
      y: clamp(dragRef.current.y + deltaY, -coverMetrics.maxY, coverMetrics.maxY),
    })
  }

  const stopDragging = () => {
    dragRef.current = null
  }

  const handleSave = async () => {
    if (!loadedImage || !coverMetrics || !imageSrc) return

    setIsSaving(true)
    setError('')

    try {
      const canvas = document.createElement('canvas')
      canvas.width = EXPORT_SIZE
      canvas.height = EXPORT_SIZE
      const ctx = canvas.getContext('2d')

      if (!ctx) throw new Error('Unable to prepare image export.')

      const exportScale = EXPORT_SIZE / FRAME_SIZE
      const drawWidth = coverMetrics.renderedWidth * exportScale
      const drawHeight = coverMetrics.renderedHeight * exportScale
      const drawX = (FRAME_SIZE / 2 - coverMetrics.renderedWidth / 2 + offset.x) * exportScale
      const drawY = (FRAME_SIZE / 2 - coverMetrics.renderedHeight / 2 + offset.y) * exportScale

      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(loadedImage.element, drawX, drawY, drawWidth, drawHeight)

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))
      if (!blob) throw new Error('Unable to export adjusted image.')

      const nextFile = new File([blob], fileName || 'adjusted-image.jpg', { type: 'image/jpeg' })
      await onSave(nextFile)
      onClose()
    } catch (err) {
      setError((err as Error).message || 'Unable to save adjusted image.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/70 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-slate-900">Adjust Image Position</p>
            <p className="mt-1 text-sm text-slate-500">
              Drag the image to choose which area stays visible. No need to remove and upload again.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="flex items-center justify-center rounded-3xl bg-slate-100 p-5">
            <div
              className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-inner"
              style={{ width: FRAME_SIZE, height: FRAME_SIZE }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={stopDragging}
              onPointerCancel={stopDragging}
              onPointerLeave={stopDragging}
            >
              {imageSrc ? (
                <div
                  className="absolute left-1/2 top-1/2 h-full w-full touch-none"
                  style={{
                    transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
                  }}
                >
                  <Image src={imageSrc} alt="Adjust preview" fill className="object-cover select-none pointer-events-none" unoptimized />
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Zoom</label>
              <input
                type="range"
                min={1}
                max={2.2}
                step={0.01}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="mt-3 w-full accent-teal-600"
              />
              <p className="mt-2 text-xs text-slate-500">Move the slider if you want a tighter crop.</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setOffset({ x: 0, y: 0 })
                setZoom(1)
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Reset Position
            </button>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!loadedImage || isSaving}
                className="flex-1 rounded-2xl bg-teal-600 px-4 py-3 text-sm font-bold text-white hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
