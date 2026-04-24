import { buildPageMetadata } from '@/app/seo'
import ProductsPageMain from '@/components/superAdmin/products/ProductsPageMain'
import { supplierAuthOptions } from '@/libs/supplierAuth'
import { normalizeProductsResponse, ProductsResponse } from '@/store/api/productsApi'
import { getServerSession } from 'next-auth'

export const metadata = buildPageMetadata({
  title: 'Supplier Products',
  description: 'Manage supplier products on AF Home.',
  path: '/supplier/products',
  noIndex: true,
})

export const dynamic = 'force-dynamic'

const normalizeKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

const pickBestBrandId = (brands: Array<{ id: number; name: string }>, candidates: string[]) => {
  const exactMatch = brands.find((brand) => {
    const brandKey = normalizeKey(String(brand.name ?? ''))
    return brandKey !== '' && candidates.some((candidate) => candidate === brandKey)
  })
  if (exactMatch?.id) {
    return Number(exactMatch.id)
  }

  let bestId = 0
  let bestScore = 0
  let bestLen = 0

  brands.forEach((brand) => {
    const brandKey = normalizeKey(String(brand.name ?? ''))
    if (!brandKey) return
    candidates.forEach((candidate) => {
      if (!candidate) return
      let score = 0
      if (candidate === brandKey) score = 3
      else if (candidate.includes(brandKey)) score = 2
      else if (brandKey.includes(candidate)) score = 1
      if (score > 0) {
        const len = brandKey.length
        if (score > bestScore || (score === bestScore && len > bestLen)) {
          bestScore = score
          bestLen = len
          bestId = Number(brand.id ?? 0)
        }
      }
    })
  })

  return bestId
}

async function resolveSupplierBrandType(apiUrl: string, accessToken: string, supplierId: number, supplierName: string | null) {
  try {
    const brandsRes = await fetch(`${apiUrl}/api/product-brands`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })

    if (!brandsRes.ok) return 0
    const brandsJson = (await brandsRes.json()) as { brands?: Array<{ id: number; name: string }> }
    const brands = brandsJson.brands ?? []
    if (brands.length === 0) return 0

    const suppliersRes = await fetch(`${apiUrl}/api/admin/suppliers`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    })
    const suppliersJson = suppliersRes.ok
      ? ((await suppliersRes.json()) as { suppliers?: Array<{ id: number; name?: string; company?: string }> })
      : { suppliers: [] }
    const supplier = (suppliersJson.suppliers ?? []).find((item) => item.id === supplierId)

    const candidates = [
      supplierName ?? '',
      supplier?.company ?? '',
      supplier?.name ?? '',
    ]
      .map((value) => value.trim())
      .filter((value) => value.length > 0)
      .map((value) => normalizeKey(value))

    if (candidates.length === 0) return 0

    return pickBestBrandId(brands, candidates)
  } catch {
    return 0
  }
}

async function getInitialProducts(): Promise<{ data: ProductsResponse | null; brandType: number }> {
  const session = await getServerSession(supplierAuthOptions)
  const accessToken = (session?.user as { accessToken?: string } | undefined)?.accessToken
  const supplierId = Number((session?.user as { supplierId?: number | null } | undefined)?.supplierId ?? 0)
  const supplierName = (session?.user as { supplierName?: string | null } | undefined)?.supplierName ?? null

  if (!accessToken) return { data: null, brandType: 0 }

  const apiUrl = process.env.LARAVEL_API_URL ?? process.env.NEXT_PUBLIC_LARAVEL_API_URL
  if (!apiUrl) return { data: null, brandType: 0 }

  const brandType = supplierId > 0 ? await resolveSupplierBrandType(apiUrl, accessToken, supplierId, supplierName) : 0
  const supplierQuery = supplierId > 0 ? `&supplier_id=${supplierId}` : ''
  const brandQuery = brandType > 0 ? `&brand_type=${brandType}` : ''
  const res = await fetch(`${apiUrl}/api/admin/products?page=1&per_page=25${supplierQuery}${brandQuery}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  })

  if (!res.ok) return { data: null, brandType }
  return { data: normalizeProductsResponse((await res.json()) as ProductsResponse), brandType }
}

export default async function SupplierProductsPage() {
  const { data: initialData, brandType } = await getInitialProducts()

  return <ProductsPageMain initialData={initialData} initialBrandType={brandType} />
}
