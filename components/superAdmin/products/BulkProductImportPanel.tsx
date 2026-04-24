'use client'

import { useMemo, useRef, useState } from 'react'
import { BulkImportProductsResponse, BulkImportProductsRow, CreateProductVariantPayload, useBulkImportProductsMutation, useBulkImportProductsWithVariantsMutation } from '@/store/api/productsApi'
import { useGetCategoriesQuery } from '@/store/api/categoriesApi'
import { useGetProductBrandsQuery } from '@/store/api/productBrandsApi'
import { showErrorToast, showSuccessToast } from '@/libs/toast'
import { ROOM_OPTIONS } from '@/libs/roomConfig'

interface BulkProductImportPanelProps {
  onClose: () => void
  onImported?: () => void
}

type ParsedCsv = {
  headers: string[]
  rows: BulkImportProductsRow[]
  isVariantSheet: boolean
}

type ParsedSuccess = ParsedCsv & { rawRows: BulkImportProductsRow[] }

const PRODUCT_REQUIRED_COLUMNS = ['pd_name', 'pd_catid', 'pd_price_srp']
const VARIANT_REQUIRED_COLUMNS = ['pd_parent_sku', 'pv_sku']
const OPTIONAL_COLUMNS = [
  'pd_parent_sku',
  'pd_brand_type',
  'pd_room_type',
  'pd_price_dp',
  'pd_price_member',
  'pd_prodpv',
  'pd_pricing_tier',
  'pd_reversed_pv_multiplier',
  'pd_qty',
  'pd_weight',
  'pd_psweight',
  'pd_pswidth',
  'pd_pslenght',
  'pd_psheight',
  'pd_description',
  'pd_specifications',
  'pd_material',
  'pd_warranty',
  'pd_image',
  'pd_images',
  'pd_type',
  'pd_status',
  'pd_musthave',
  'pd_bestseller',
  'pd_salespromo',
  'pd_assembly_required',
  'pd_verified',
]

const IMPORT_COLUMNS = [...PRODUCT_REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS]
const HEADER_ALIASES: Record<string, string> = {
  'product name': 'pd_name',
  'parent sku': 'pd_parent_sku',
  'main product sku': 'pd_parent_sku',
  'main product name': 'pd_name',
  'category': 'pd_catid',
  'category id': 'pd_catid',
  'room type': 'pd_room_type',
  'brand': 'pd_brand_type',
  'brand type': 'pd_brand_type',
  'price srp': 'pd_price_srp',
  'srp price': 'pd_price_srp',
  'price dp': 'pd_price_dp',
  'dp price': 'pd_price_dp',
  'price member': 'pd_price_member',
  'member price': 'pd_price_member',
  'product pv': 'pd_prodpv',
  'pv pricing tier': 'pd_pricing_tier',
  'pricing tier': 'pd_pricing_tier',
  'pv multiplier': 'pd_reversed_pv_multiplier',
  'reversed pv multiplier': 'pd_reversed_pv_multiplier',
  'quantity': 'pd_qty',
  'weight': 'pd_weight',
  'package weight': 'pd_psweight',
  'package width': 'pd_pswidth',
  'pacakge width': 'pd_pswidth',
  'package length': 'pd_pslenght',
  'package height': 'pd_psheight',
  'description': 'pd_description',
  'specifications': 'pd_specifications',
  'material': 'pd_material',
  'warranty': 'pd_warranty',
  'image': 'pd_image',
  'images': 'pd_images',
  'product type': 'pd_type',
  'status': 'pd_status',
  'must have': 'pd_musthave',
  'best seller': 'pd_bestseller',
  'sales promo': 'pd_salespromo',
  'assembly required': 'pd_assembly_required',
  'verified': 'pd_verified',
  'variant sku': 'pv_sku',
  'variant name': 'pv_name',
  'variant color': 'pv_color',
  'color name': 'pv_color',
  'variant color hex': 'pv_color_hex',
  'color hex': 'pv_color_hex',
  'variant size': 'pv_size',
  'variant style': 'pv_style',
  'variant width': 'pv_width',
  'variant dimension': 'pv_dimension',
  'variant height': 'pv_height',
  'variant price srp': 'pv_price_srp',
  'variant price dp': 'pv_price_dp',
  'variant price member': 'pv_price_member',
  'variant pv': 'pv_prodpv',
  'variant qty': 'pv_qty',
  'variant status': 'pv_status',
  'variant images': 'pv_images',
}
const PREVIEW_COLUMNS = [
  'pd_name',
  'pd_parent_sku',
  'pd_catid',
  'pd_room_type',
  'pd_brand_type',
  'pd_price_srp',
  'pd_price_dp',
  'pd_price_member',
  'pd_prodpv',
  'pd_pricing_tier',
  'pd_reversed_pv_multiplier',
  'pd_qty',
  'pd_weight',
  'pd_psweight',
  'pd_pswidth',
  'pd_pslenght',
  'pd_psheight',
  'pd_description',
  'pd_specifications',
  'pd_material',
  'pd_warranty',
  'pd_images',
  'pd_type',
  'pd_status',
  'pd_musthave',
  'pd_bestseller',
  'pd_salespromo',
  'pd_assembly_required',
  'pd_verified',
]

const VARIANT_PREVIEW_COLUMNS = [
  'pd_parent_sku',
  'pd_name',
  'pd_catid',
  'pd_room_type',
  'pd_brand_type',
  'pd_price_srp',
  'pd_price_dp',
  'pd_price_member',
  'pd_prodpv',
  'pd_pricing_tier',
  'pd_reversed_pv_multiplier',
  'pd_qty',
  'pd_weight',
  'pd_psweight',
  'pd_pswidth',
  'pd_pslenght',
  'pd_psheight',
  'pd_description',
  'pd_specifications',
  'pd_material',
  'pd_warranty',
  'pd_images',
  'pd_type',
  'pd_status',
  'pd_musthave',
  'pd_bestseller',
  'pd_salespromo',
  'pd_assembly_required',
  'pd_verified',
  'pv_sku',
  'pv_name',
  'pv_color',
  'pv_color_hex',
  'pv_size',
  'pv_style',
  'pv_width',
  'pv_dimension',
  'pv_height',
  'pv_price_srp',
  'pv_price_dp',
  'pv_price_member',
  'pv_prodpv',
  'pv_qty',
  'pv_status',
  'pv_images',
]

const PRICE_COLUMNS = new Set([
  'pd_price_srp', 'pd_price_dp', 'pd_price_member',
  'pd_prodpv', 'pd_reversed_pv_multiplier',
  'pd_qty', 'pd_weight', 'pd_psweight', 'pd_pswidth', 'pd_pslenght', 'pd_psheight',
  'pv_price_srp', 'pv_price_dp', 'pv_price_member', 'pv_prodpv', 'pv_qty',
])

const BOOLEAN_COLUMNS = new Set([
  'pd_musthave', 'pd_bestseller', 'pd_salespromo', 'pd_assembly_required', 'pd_verified',
])

const normalizeBoolean = (val: string): string => {
  const lower = val.toLowerCase().trim()
  if (['yes', 'true', 'y', '1', 'active'].includes(lower)) return '1'
  if (['no', 'false', 'n', '0', 'inactive'].includes(lower)) return '0'
  return val
}

const normalizeWord = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')

const normalizeHeader = (value: string) => normalizeWord(value)

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const looksLikeHtml = (value: string) => /<\/?[a-z][\s\S]*>/i.test(value)

const plainTextToHtml = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (looksLikeHtml(trimmed)) return trimmed

  const lines = trimmed.split(/\r?\n/)
  const blocks: string[] = []
  let listItems: string[] = []
  let paragraphLines: string[] = []

  const flushParagraph = () => {
    const text = paragraphLines.join(' ').trim()
    if (text) blocks.push(`<p>${escapeHtml(text)}</p>`)
    paragraphLines = []
  }

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push(`<ul>${listItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`)
      listItems = []
    }
  }

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (!trimmedLine) {
      flushParagraph()
      flushList()
      continue
    }

    if (/^[-*•]\s+/.test(trimmedLine)) {
      flushParagraph()
      listItems.push(trimmedLine.replace(/^[-*•]\s+/, ''))
      continue
    }

    flushList()
    paragraphLines.push(trimmedLine)
  }

  flushParagraph()
  flushList()

  return blocks.join('')
}

const normalizeStatus = (val: string): string => {
  const lower = normalizeWord(val)
  if (['active', 'published', 'live', '1'].includes(lower)) return '1'
  if (['inactive', 'draft', 'unpublished', '0'].includes(lower)) return '0'
  return val
}

const normalizeProductType = (val: string): string => {
  const lower = normalizeWord(val)
  if (['simple', '0'].includes(lower)) return '0'
  if (['variable', 'variant', 'variants', '1'].includes(lower)) return '1'
  return val
}

const normalizeRoomType = (val: string): string => {
  const trimmed = val.trim()
  if (!trimmed || /^\d+$/.test(trimmed)) return trimmed

  const normalized = normalizeWord(trimmed)
  const exactMatch = ROOM_OPTIONS.find((room) => normalizeWord(room.label) === normalized || normalizeWord(room.slug) === normalized)
  if (exactMatch) return String(exactMatch.id)

  const partialMatch = ROOM_OPTIONS.find((room) => {
    const label = normalizeWord(room.label)
    const slug = normalizeWord(room.slug)
    return label.includes(normalized) || normalized.includes(label) || slug.includes(normalized) || normalized.includes(slug)
  })

  return partialMatch ? String(partialMatch.id) : trimmed
}

const normalizeLookupValue = (
  val: string,
  lookup: Array<{ id: number; name: string }>,
): string => {
  const trimmed = val.trim()
  if (!trimmed || /^\d+$/.test(trimmed)) return trimmed

  const normalized = normalizeWord(trimmed)
  const exactMatch = lookup.find((item) => normalizeWord(item.name) === normalized)
  if (exactMatch) return String(exactMatch.id)

  const partialMatch = lookup.find((item) => {
    const name = normalizeWord(item.name)
    return name.includes(normalized) || normalized.includes(name)
  })

  return partialMatch ? String(partialMatch.id) : trimmed
}

const normalizeRow = (row: Record<string, string>): Record<string, string> => {
  const result: Record<string, string> = {}
  for (const [key, raw] of Object.entries(row)) {
    let val = raw
    if (PRICE_COLUMNS.has(key)) {
      val = val.replace(/,/g, '')
    } else if (BOOLEAN_COLUMNS.has(key)) {
      val = normalizeBoolean(val)
    } else if (key === 'pd_status') {
      val = normalizeStatus(val)
    } else if (key === 'pd_type') {
      val = normalizeProductType(val)
    } else if (key === 'pd_room_type') {
      val = normalizeRoomType(val)
    } else if (key === 'pd_description') {
      val = plainTextToHtml(val)
    }
    result[key] = val
  }
  return result
}

const detectDelimiter = (line: string) => {
  const candidates = [',', '\t', ';']
  let best = ','
  let maxCount = -1

  for (const candidate of candidates) {
    const count = (line.match(new RegExp(`\\${candidate}`, 'g')) ?? []).length
    if (count > maxCount) {
      best = candidate
      maxCount = count
    }
  }

  return best
}

const parseCsvLine = (line: string, delimiter: string) => {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const next = line[index + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"'
        index += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === delimiter && !inQuotes) {
      values.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  values.push(current.trim())
  return values.map((value) => value.replace(/^"|"$/g, '').trim())
}

const normalizeCsvValues = (headers: string[], values: string[]) => {
  if (values.length <= headers.length) {
    return values
  }

  const normalized: string[] = []
  let valueIndex = 0

  for (let headerIndex = 0; headerIndex < headers.length; headerIndex += 1) {
    const header = headers[headerIndex]
    const remainingHeaders = headers.length - headerIndex - 1
    const remainingValues = values.length - valueIndex

    if (remainingValues <= remainingHeaders + 1) {
      normalized.push(values[valueIndex] ?? '')
      valueIndex += 1
      continue
    }

    if (PRICE_COLUMNS.has(header)) {
      const tokensToKeep = Math.max(1, remainingValues - remainingHeaders)
      normalized.push(values.slice(valueIndex, valueIndex + tokensToKeep).join(','))
      valueIndex += tokensToKeep
      continue
    }

    normalized.push(values[valueIndex] ?? '')
    valueIndex += 1
  }

  while (normalized.length < headers.length) {
    normalized.push('')
  }

  return normalized
}

const parseCsvText = (text: string): ParsedCsv => {
  const lines = text
    .replace(/^﻿/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) {
    throw new Error('CSV must include a header row and at least one product row.')
  }

  const delimiter = detectDelimiter(lines[0])
  const rawHeaders = parseCsvLine(lines[0], delimiter).map((header) => header.trim())
  const headers = rawHeaders.map((header) => HEADER_ALIASES[normalizeHeader(header)] ?? header)
  const isVariantSheet =
    headers.includes('pv_sku') ||
    headers.includes('pv_name') ||
    headers.includes('pv_style') ||
    headers.includes('pv_size') ||
    headers.includes('pv_images')

  const requiredColumns = isVariantSheet ? VARIANT_REQUIRED_COLUMNS : PRODUCT_REQUIRED_COLUMNS
  const missing = requiredColumns.filter((column) => !headers.includes(column))
  if (missing.length > 0) {
    throw new Error(`Missing required column(s): ${missing.join(', ')}`)
  }

  const rows = lines.slice(1).map((line) => {
    const values = normalizeCsvValues(headers, parseCsvLine(line, delimiter))
    const raw: Record<string, string> = {}
    headers.forEach((header, index) => {
      raw[header] = values[index] ?? ''
    })
    return normalizeRow(raw)
  })

  return { headers: headers.filter((header) => IMPORT_COLUMNS.includes(header)), rows, isVariantSheet }
}

const VARIANT_COLUMNS = [
  'pv_sku', 'pv_name', 'pv_color', 'pv_color_hex', 'pv_size', 'pv_style',
  'pv_width', 'pv_dimension', 'pv_height',
  'pv_price_srp', 'pv_price_dp', 'pv_price_member', 'pv_prodpv',
  'pv_qty', 'pv_status', 'pv_images',
] as const

const rowHasVariantData = (row: Record<string, string>) =>
  VARIANT_COLUMNS.some((col) => (row[col] ?? '').trim() !== '')

const extractVariant = (row: Record<string, string>): CreateProductVariantPayload => ({
  pv_sku: row.pv_sku?.trim() || undefined,
  pv_name: row.pv_name?.trim() || undefined,
  pv_color: row.pv_color?.trim() || undefined,
  pv_color_hex: row.pv_color_hex?.trim() || undefined,
  pv_size: row.pv_size?.trim() || undefined,
  pv_style: row.pv_style?.trim() || undefined,
  pv_width: row.pv_width?.trim() ? Number(row.pv_width) : undefined,
  pv_dimension: row.pv_dimension?.trim() ? Number(row.pv_dimension) : undefined,
  pv_height: row.pv_height?.trim() ? Number(row.pv_height) : undefined,
  pv_price_srp: row.pv_price_srp?.trim() ? Number(row.pv_price_srp) : undefined,
  pv_price_dp: row.pv_price_dp?.trim() ? Number(row.pv_price_dp) : undefined,
  pv_price_member: row.pv_price_member?.trim() ? Number(row.pv_price_member) : undefined,
  pv_prodpv: row.pv_prodpv?.trim() ? Number(row.pv_prodpv) : undefined,
  pv_qty: row.pv_qty?.trim() ? Number(row.pv_qty) : undefined,
  pv_status: row.pv_status?.trim() ? Number(row.pv_status) : undefined,
  pv_images: row.pv_images?.trim() ? row.pv_images.split('|').map((u) => u.trim()).filter(Boolean) : undefined,
})

const groupVariantRows = (rows: BulkImportProductsRow[]): BulkImportProductsRow[] => {
  const skuMap = new Map<string, BulkImportProductsRow>()
  const noSkuRows: BulkImportProductsRow[] = []
  const ordered: string[] = []

  for (const row of rows) {
    const rawRow = row as Record<string, string>
    const sku = (row.pd_parent_sku ?? '').trim()

    if (!sku) {
      noSkuRows.push(row)
      continue
    }

    if (!skuMap.has(sku)) {
      ordered.push(sku)
      skuMap.set(sku, { ...row, pd_variants: [] })
    }

    if (rowHasVariantData(rawRow)) {
      const parent = skuMap.get(sku)!
      parent.pd_variants = [...(parent.pd_variants ?? []), extractVariant(rawRow)]
      if ((parent.pd_variants?.length ?? 0) > 0) {
        parent.pd_type = 1
      }
    }
  }

  const grouped = ordered.map((sku) => {
    const row = skuMap.get(sku)!
    const srp = Number(row.pd_price_srp)
    if (!Number.isFinite(srp) || srp <= 0) {
      const variantPrices = (row.pd_variants ?? [])
        .map((v) => Number(v.pv_price_srp))
        .filter((n) => Number.isFinite(n) && n > 0)
      if (variantPrices.length > 0) {
        row.pd_price_srp = String(Math.min(...variantPrices))
      }
    }
    return row
  })
  return [...grouped, ...noSkuRows]
}

const VIEW_TEMPLATE_NO_VARIANT_URL = 'https://docs.google.com/spreadsheets/d/1bt9hMYtxIBvsNcdJ-Q7V7BKdcToa5_9FP942K0XzjCg/edit?usp=sharing'
const VIEW_TEMPLATE_VARIANT_URL = 'https://docs.google.com/spreadsheets/d/1bt9hMYtxIBvsNcdJ-Q7V7BKdcToa5_9FP942K0XzjCg/edit?gid=1844511908#gid=1844511908'

export default function BulkProductImportPanel({ onClose, onImported }: BulkProductImportPanelProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [fileName, setFileName] = useState('')
  const [csvText, setCsvText] = useState('')
  const [importMode, setImportMode] = useState<'create_only' | 'create_or_update'>('create_or_update')
  const [fileError, setFileError] = useState('')
  const [importResults, setImportResults] = useState<BulkImportProductsResponse['results'] | null>(null)
  const { data: categoryData } = useGetCategoriesQuery({ per_page: 500 })
  const { data: brandData } = useGetProductBrandsQuery({ search: '' })
  const [importProducts, { isLoading: isLoadingRegular }] = useBulkImportProductsMutation()
  const [importProductsWithVariants, { isLoading: isLoadingVariants }] = useBulkImportProductsWithVariantsMutation()
  const isLoading = isLoadingRegular || isLoadingVariants

  const categoryLookup = useMemo(() => categoryData?.categories ?? [], [categoryData])
  const brandLookup = useMemo(() => brandData?.brands ?? [], [brandData])

  const parsedResult = useMemo(() => {
    if (!csvText.trim()) return null

    try {
      const result = parseCsvText(csvText)
      return { ...result, rawRows: result.rows, rows: groupVariantRows(result.rows) }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to parse CSV file.' }
    }
  }, [csvText])

  const parsed = ('error' in (parsedResult ?? {}) ? null : parsedResult) as ParsedSuccess | null

  const parseError = useMemo(() => {
    if (!csvText.trim()) return ''
    if (parsedResult && 'error' in parsedResult) return parsedResult.error
    return ''
  }, [csvText, parsedResult])

  const normalizedRows = useMemo(() => {
    if (!parsed) return null

    return parsed.rows.map((row) => ({
      ...row,
      pd_catid: normalizeLookupValue(String(row.pd_catid ?? ''), categoryLookup),
      pd_brand_type: normalizeLookupValue(String(row.pd_brand_type ?? ''), brandLookup),
      pd_room_type: normalizeRoomType(String(row.pd_room_type ?? '')),
    }))
  }, [brandLookup, categoryLookup, parsed])

  const previewRows = useMemo(
    () =>
      (parsed?.rows ?? []).map((row, index) => {
        const variants = row.pd_variants ?? []
        const srpValues = variants.map((v) => Number(v.pv_price_srp)).filter((n) => Number.isFinite(n) && n > 0)
        const minSrp = srpValues.length ? Math.min(...srpValues) : 0
        const maxSrp = srpValues.length ? Math.max(...srpValues) : 0
        const totalQty = variants.reduce((sum, v) => sum + (Number.isFinite(Number(v.pv_qty)) ? Number(v.pv_qty) : 0), 0)
        return {
          index: index + 1,
          name: String(row.pd_name ?? '').trim() || 'Unnamed product',
          sku: String(row.pd_parent_sku ?? '').trim() || 'No SKU',
          category: String(row.pd_catid ?? '').trim() || 'N/A',
          srp: String(row.pd_price_srp ?? '').trim() || '0',
          qty: String(row.pd_qty ?? '').trim() || '0',
          variantCount: variants.length,
          variantSrpRange: minSrp === maxSrp ? String(minSrp) : `${minSrp} – ${maxSrp}`,
          variantTotalQty: totalQty,
          variants,
          row,
        }
      }),
    [parsed],
  )

  const handleClear = () => {
    setFileName('')
    setCsvText('')
    setFileError('')
    setImportResults(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handlePickFile = async (file?: File | null) => {
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setFileError('Please upload a .csv file.')
      return
    }

    setFileError('')
    const text = await file.text()
    setFileName(file.name)
    setCsvText(text)
  }

  const handleImport = async () => {
    if (!parsed || parsed.rows.length === 0) {
      showErrorToast('Upload a valid CSV file first.')
      return
    }

    setImportResults(null)

    try {
      const rows = normalizedRows ?? parsed.rows
      const payload = { mode: importMode, rows }
      const response = await (parsed.isVariantSheet
        ? importProductsWithVariants(payload)
        : importProducts(payload)
      ).unwrap()

      const { summary, results } = response
      const failedRows = results.filter((r) => r.status === 'failed')

      if (failedRows.length > 0) {
        setImportResults(results)
        showErrorToast(`Import finished with errors: ${summary.created} created, ${summary.updated} updated, ${summary.failed} failed.`)
        if (summary.created > 0 || summary.updated > 0) onImported?.()
      } else {
        showSuccessToast(`Import finished: ${summary.created} created, ${summary.updated} updated.`)
        onImported?.()
        onClose()
      }
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message || 'Bulk import failed.'
      showErrorToast(message)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 space-y-5">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Upload one CSV file to create many products at once. Required columns: <span className="font-semibold">{PRODUCT_REQUIRED_COLUMNS.join(', ')}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
            </svg>
            Select CSV File
          </button>
          <a
            href={VIEW_TEMPLATE_NO_VARIANT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View Template (No Variants)
          </a>
          <a
            href={VIEW_TEMPLATE_VARIANT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
          >
            View Template (With Variants)
          </a>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(event) => void handlePickFile(event.target.files?.[0] ?? null)}
          />
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
          After filling in your data in the Google Sheet template, download it as <span className="font-semibold">.csv</span> before uploading here.
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">Import Mode</p>
              <p className="text-xs text-slate-500">Choose whether matching SKU rows should create only or update existing products.</p>
            </div>
            <div className="flex rounded-xl bg-slate-100 p-1">
              {[
                { value: 'create_or_update', label: 'Create or Update' },
                { value: 'create_only', label: 'Create Only' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setImportMode(option.value as 'create_only' | 'create_or_update')}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    importMode === option.value ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="grid gap-3 text-xs text-slate-500 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-slate-700">Important Notes</p>
                <ul className="mt-2 space-y-1 text-slate-600 list-disc list-inside">
                  <li>Column order doesn&apos;t matter — header names are matched by name</li>
                  <li>Only 3 columns are required: <span className="font-mono font-semibold text-slate-700">pd_name</span>, <span className="font-mono font-semibold text-slate-700">pd_catid</span>, <span className="font-mono font-semibold text-slate-700">pd_price_srp</span></li>
                  <li>Skip any optional column by leaving it blank or removing it</li>
                  <li>Multiple images: separate URLs with pipe <span className="font-mono">url1|url2</span></li>
                  <li>Prices support commas — <span className="font-mono">4,999.00</span> and <span className="font-mono">4999.00</span> both work</li>
                  <li>Boolean fields accept: <span className="font-mono">1/0</span>, <span className="font-mono">yes/no</span>, <span className="font-mono">true/false</span></li>
                  <li>Status and flag columns accept <span className="font-mono">Active</span> or <span className="font-mono">Inactive</span> and are normalized to <span className="font-mono">1</span> or <span className="font-mono">0</span></li>
                  <li>Category, room type, brand, pricing tier, warranty, product type, and status/flag values can be pasted as labels or database IDs when available</li>
                  <li>SKU is required for &quot;Create or Update&quot; mode matching</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-slate-700">Field Reference</p>
                <ul className="mt-2 space-y-0.5 text-slate-600 list-disc list-inside text-[11px]">
                  <li><span className="font-mono">pd_catid</span> — category name or numeric category ID</li>
                  <li><span className="font-mono">pd_room_type</span> — room label or numeric room ID</li>
                  <li><span className="font-mono">pd_brand_type</span> — brand name or numeric brand ID</li>
                  <li><span className="font-mono">pd_pricing_tier</span> — tier label or value</li>
                  <li><span className="font-mono">pd_warranty</span> — warranty label or custom text</li>
                  <li><span className="font-mono">pd_type</span> — product type label or numeric value</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {fileName ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-700 truncate">
              Selected file: <span className="font-semibold">{fileName}</span>
            </p>
            <button
              type="button"
              onClick={handleClear}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          </div>
        ) : null}

        {fileError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{fileError}</div>
        ) : null}

        {parseError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{parseError}</div>
        ) : null}

        {importResults ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 overflow-hidden">
            <div className="border-b border-red-100 px-4 py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-red-800">Import Errors</p>
                <p className="text-xs text-red-600">{importResults.filter((r) => r.status === 'failed').length} row(s) failed — fix the data and re-upload.</p>
              </div>
              <button
                type="button"
                onClick={() => setImportResults(null)}
                className="shrink-0 rounded-lg p-1 text-red-400 transition hover:bg-red-100 hover:text-red-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-64 overflow-auto divide-y divide-red-100">
              {importResults.filter((r) => r.status === 'failed').map((r) => (
                <div key={r.row} className="px-4 py-3">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-600">Row {r.row}</span>
                    <div className="min-w-0">
                      {(r.name || r.sku) && (
                        <p className="text-xs font-semibold text-red-800 truncate">
                          {r.name ?? ''}{r.name && r.sku ? ' — ' : ''}{r.sku ? `SKU: ${r.sku}` : ''}
                        </p>
                      )}
                      <p className="text-xs text-red-700 mt-0.5">{r.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {parsed ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Rows Ready</p>
                <p className="mt-1 text-2xl font-bold text-slate-800">{parsed.rows.length}</p>
                <p className="text-xs text-slate-500">Products detected in this CSV</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Columns Found</p>
                <p className="mt-1 text-2xl font-bold text-slate-800">{parsed.headers.length}</p>
                <p className="text-xs text-slate-500">CSV headers recognized</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Mode</p>
                <p className="mt-1 text-lg font-bold text-slate-800">{importMode === 'create_or_update' ? 'Create or Update' : 'Create Only'}</p>
                <p className="text-xs text-slate-500">Import behavior for matching SKU</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">Upload Summary</p>
                <p className="text-xs text-slate-500">Products that will be imported when you proceed.</p>
              </div>
              <div className="max-h-80 overflow-auto divide-y divide-slate-100">
                {previewRows.map((row) => (
                  <div key={`${row.index}-${row.sku}-${row.name}`} className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">Row {row.index}</span>
                      <p className="text-sm font-semibold text-slate-800">{row.name}</p>
                    </div>
                    {parsed.isVariantSheet ? (
                      <div className="mt-1.5 space-y-1">
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                          <span>SKU: {row.sku}</span>
                          <span>SRP: PHP {row.variantSrpRange}</span>
                          <span>Total Qty: {row.variantTotalQty}</span>
                          <span className="inline-flex rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-700">
                            {row.variantCount} variant{row.variantCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                        {row.variants.length > 0 && (
                          <div className="mt-1 flex flex-col gap-0.5">
                            {row.variants.map((v, vi) => (
                              <div key={vi} className="flex flex-wrap gap-x-2 text-[11px] text-slate-400 pl-2 border-l-2 border-violet-200">
                                <span className="font-medium text-slate-600">{v.pv_name ?? v.pv_sku ?? `Variant ${vi + 1}`}</span>
                                {v.pv_sku && <span>SKU: {v.pv_sku}</span>}
                                {v.pv_style && <span>Style: {v.pv_style}</span>}
                                {v.pv_size && <span>Size: {v.pv_size}</span>}
                                {v.pv_color && <span>Color: {v.pv_color}</span>}
                                {Number.isFinite(v.pv_price_srp) && v.pv_price_srp! > 0 && <span>PHP {v.pv_price_srp}</span>}
                                {Number.isFinite(v.pv_qty) && <span>Qty: {v.pv_qty}</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span>SKU: {row.sku}</span>
                        <span>Category ID: {row.category}</span>
                        <span>SRP: PHP {row.srp}</span>
                        <span>Qty: {row.qty}</span>
                        {row.variantCount > 0 && (
                          <span className="inline-flex rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-700">
                            {row.variantCount} variant{row.variantCount !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">Raw Preview</p>
                <p className="text-xs text-slate-500">Full table view of the uploaded CSV fields.</p>
              </div>
              <div className="max-h-96 overflow-auto">
                <table className="min-w-[2200px] divide-y divide-slate-100 text-left text-[11px]">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="sticky left-0 z-10 bg-slate-50 px-4 py-3 font-semibold text-slate-600">Row</th>
                      {(parsed.isVariantSheet ? VARIANT_PREVIEW_COLUMNS : PREVIEW_COLUMNS).map((header) => (
                        <th key={header} className="px-4 py-3 font-semibold text-slate-600 whitespace-nowrap">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsed.isVariantSheet
                      ? (parsed.rawRows ?? []).map((row: BulkImportProductsRow, index: number) => (
                          <tr key={index} className="bg-white align-top">
                            <td className="sticky left-0 z-10 bg-white px-4 py-3 font-semibold text-slate-500">
                              {index + 1}
                            </td>
                            {VARIANT_PREVIEW_COLUMNS.map((header) => {
                              const value = String((row as Record<string, unknown>)[header] ?? '').trim()
                              return (
                                <td
                                  key={`${index}-${header}`}
                                  className="px-4 py-3 text-slate-600 whitespace-normal break-words max-w-[220px]"
                                >
                                  {value || '—'}
                                </td>
                              )
                            })}
                          </tr>
                        ))
                      : previewRows.map((preview: (typeof previewRows)[number]) => (
                          <tr key={preview.index} className="bg-white align-top">
                            <td className="sticky left-0 z-10 bg-white px-4 py-3 font-semibold text-slate-500">
                              {preview.index}
                            </td>
                            {PREVIEW_COLUMNS.map((header) => {
                              const value = String((preview.row as Record<string, unknown>)[header] ?? '').trim()
                              return (
                                <td
                                  key={`${preview.index}-${header}`}
                                  className="px-4 py-3 text-slate-600 whitespace-normal break-words max-w-[220px]"
                                >
                                  {value || '—'}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="shrink-0 border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-6 sm:py-4 flex items-center gap-3">
        <p className="text-xs text-slate-400 flex-1">Manual add still works. This option is only for bulk CSV imports.</p>
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleImport}
          disabled={isLoading || !parsed || parsed.rows.length === 0}
          className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-teal-500/30 transition hover:bg-teal-700 disabled:opacity-60"
        >
          {isLoading ? 'Importing...' : 'Import Products'}
        </button>
      </div>
    </div>
  )
}
