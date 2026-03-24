'use client'

import { useMemo, useState } from 'react'

type ToneOption = 'ecommerce' | 'warm' | 'premium'
type LengthOption = 'short' | 'medium' | 'long'

export interface ProductDescriptionGeneratorInput {
  productName: string
  categoryName?: string
  roomLabel?: string
  brandName?: string
  material?: string
  warranty?: string
  assemblyRequired?: boolean
  width?: string
  depth?: string
  height?: string
}

function normalize(value?: string) {
  return (value ?? '').trim()
}

function sentenceCase(value: string) {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function buildProductDescription(
  input: ProductDescriptionGeneratorInput,
  tone: ToneOption,
  length: LengthOption,
  extraNotes: string,
) {
  const productName = normalize(input.productName) || 'This product'
  const categoryName = normalize(input.categoryName)
  const roomLabel = normalize(input.roomLabel)
  const brandName = normalize(input.brandName)
  const material = normalize(input.material)
  const warranty = normalize(input.warranty)
  const width = normalize(input.width)
  const depth = normalize(input.depth)
  const height = normalize(input.height)
  const notes = normalize(extraNotes)

  const audienceLead = tone === 'premium'
    ? `${productName} delivers a refined balance of style, function, and everyday comfort.`
    : tone === 'warm'
      ? `${productName} is designed to make your space feel more inviting, practical, and easy to enjoy every day.`
      : `${productName} is a practical and stylish choice for homes that need dependable function and a clean modern look.`

  const categorySentence = categoryName
    ? `${sentenceCase(productName)} belongs to the ${categoryName} category${roomLabel ? ` and works especially well in ${roomLabel.toLowerCase()} spaces` : ''}.`
    : roomLabel
      ? `${sentenceCase(productName)} is well-suited for ${roomLabel.toLowerCase()} spaces and everyday home use.`
      : ''

  const materialSentence = material
    ? `Made with ${material.toLowerCase()}, it offers a look and feel that fits both comfort and long-term use.`
    : `Its overall design focuses on versatility, visual appeal, and reliable everyday use.`

  const sizeParts = [
    width ? `W ${width} cm` : '',
    depth ? `D ${depth} cm` : '',
    height ? `H ${height} cm` : '',
  ].filter(Boolean)

  const sizeSentence = sizeParts.length > 0
    ? `The listed dimensions of ${sizeParts.join(' • ')} help buyers understand how it can fit into their intended space.`
    : ''

  const brandSentence = brandName
    ? `As part of the ${brandName} line, it can also pair well with related pieces for a more cohesive setup.`
    : ''

  const assemblySentence = typeof input.assemblyRequired === 'boolean'
    ? input.assemblyRequired
      ? `Assembly is required upon delivery, making it ideal for customers who want a space-efficient setup before final placement.`
      : `No assembly is required, so it is ready for straightforward placement and use.`
    : ''

  const warrantySentence = warranty
    ? `It also comes with ${warranty.toLowerCase()}, giving added confidence for after-purchase support.`
    : ''

  const notesSentence = notes
    ? `Key selling note: ${notes}.`
    : ''

  const closingSentence = tone === 'premium'
    ? `Overall, this piece is a polished option for customers looking for form, function, and a more elevated home presentation.`
    : tone === 'warm'
      ? `Overall, it is a thoughtful addition for anyone who wants comfort, style, and practical use in one piece.`
      : `Overall, it is a solid option for customers who want a functional product with an easy-to-style design.`

  const sentences = [
    audienceLead,
    categorySentence,
    materialSentence,
    length !== 'short' ? sizeSentence : '',
    length === 'long' ? brandSentence : '',
    assemblySentence,
    warrantySentence,
    notesSentence,
    closingSentence,
  ].filter(Boolean)

  const trimmedSentences = length === 'short'
    ? sentences.slice(0, 4)
    : length === 'medium'
      ? sentences.slice(0, 6)
      : sentences

  return `<p>${trimmedSentences.join(' ')}</p>`
}

interface ProductDescriptionGeneratorProps {
  input: ProductDescriptionGeneratorInput
  disabled?: boolean
  onGenerate: (html: string) => void
}

export default function ProductDescriptionGenerator({
  input,
  disabled = false,
  onGenerate,
}: ProductDescriptionGeneratorProps) {
  const [tone, setTone] = useState<ToneOption>('ecommerce')
  const [length, setLength] = useState<LengthOption>('medium')
  const [notes, setNotes] = useState('')

  const canGenerate = useMemo(
    () => normalize(input.productName).length > 0,
    [input.productName],
  )

  const handleGenerate = () => {
    if (!canGenerate || disabled) return
    onGenerate(buildProductDescription(input, tone, length, notes))
  }

  return (
    <div className="rounded-2xl border border-cyan-100 bg-[linear-gradient(135deg,rgba(236,254,255,0.95),rgba(248,250,252,0.98))] p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-700">Smart Description Helper</p>
          <h3 className="mt-1 text-sm font-bold text-slate-900">Generate product description from form details</h3>
          <p className="mt-1 text-xs text-slate-500">
            Free template-based generator. Uses the current product name, category, room, material, dimensions, and notes.
          </p>
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!canGenerate || disabled}
          className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-cyan-500/30 transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Generate Description
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Tone</span>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as ToneOption)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-100"
          >
            <option value="ecommerce">Ecommerce</option>
            <option value="warm">Warm</option>
            <option value="premium">Premium</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Length</span>
          <select
            value={length}
            onChange={(e) => setLength(e.target.value as LengthOption)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-100"
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </label>

        <label className="block md:col-span-1">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Extra Notes</span>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional selling angle or usage note"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-100"
          />
        </label>
      </div>

      {!canGenerate && (
        <p className="mt-3 text-xs text-amber-700">
          Add a product name first so the generator has something to work with.
        </p>
      )}
    </div>
  )
}
