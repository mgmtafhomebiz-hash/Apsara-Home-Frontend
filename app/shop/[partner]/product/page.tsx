import { notFound, redirect } from 'next/navigation'
import CategoryListProductMain from '@/components/category/CategoryListProductMain'
import { buildPageMetadata } from '@/app/seo'
import { filterPartnerCategories, getPartnerStorefrontConfig } from '@/libs/partnerStorefront'
import type { CategoryProduct } from '@/libs/CategoryData'
import type { Category } from '@/store/api/categoriesApi'
import type { Product } from '@/store/api/productsApi'
import type { WebPageItem } from '@/store/api/webPagesApi'

type PageProps = {
  params: Promise<{
    partner: string
  }>
}

type ApiCategoriesResponse = {
  categories?: Category[]
}

type ApiProductsResponse = {
  products?: Product[]
  meta?: {
    last_page?: number
  }
}

type ApiWebPagesResponse = {
  items?: WebPageItem[]
}

const REQUEST_TIMEOUT_MS = 12000
const MAX_PRODUCT_PAGES_PER_CATEGORY = 4

async function fetchWithTimeout(input: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }
}

const resolveImageUrl = (rawImage: string | null | undefined, apiUrl?: string) => {
  if (!rawImage) return '/Images/HeroSection/chairs_stools.jpg'
  if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) return rawImage
  if (rawImage.startsWith('/')) return rawImage
  if (!apiUrl) return `/${rawImage}`
  return `${apiUrl.replace(/\/$/, '')}/${rawImage.replace(/^\/+/, '')}`
}

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    try {
      const parsed = JSON.parse(value) as unknown
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      }
    } catch {
      return [value]
    }
    return [value]
  }

  return []
}

const mapProductToDisplay = (product: Product, apiUrl?: string): CategoryProduct => ({
  id: product.id,
  name: product.name,
  createdAt: product.createdAt ?? null,
  price: Number(product.priceSrp ?? 0),
  priceSrp: Number(product.priceSrp ?? 0) || undefined,
  priceDp: Number(product.priceDp ?? 0) || undefined,
  priceMember: Number(product.priceMember ?? 0) || undefined,
  prodpv: Number(product.prodpv ?? 0) || undefined,
  image: resolveImageUrl(product.image, apiUrl),
  images: toStringArray(product.images).map((item) => resolveImageUrl(item, apiUrl)),
  badge: product.salespromo ? 'SALE' : product.bestseller ? 'BEST SELLER' : product.musthave ? 'MUST HAVE' : undefined,
  verified: Boolean(product.verified),
  stock: Number(product.qty ?? 0),
  brand: product.brand ?? undefined,
  sku: product.sku ?? undefined,
  variants: product.variants ?? undefined,
  type: product.type,
  musthave: Boolean(product.musthave),
  bestseller: Boolean(product.bestseller),
  salespromo: Boolean(product.salespromo),
  manualCheckoutEnabled: Boolean(product.manualCheckoutEnabled),
  weight: Number(product.weight ?? 0) || undefined,
  psweight: Number(product.psweight ?? 0) || undefined,
  pswidth: Number(product.pswidth ?? 0) || undefined,
  pslenght: Number(product.pslenght ?? 0) || undefined,
  psheight: Number(product.psheight ?? 0) || undefined,
  material: product.material ?? undefined,
  assemblyRequired: Boolean(product.assemblyRequired),
  warranty: product.warranty ?? undefined,
})

export async function generateMetadata({ params }: PageProps) {
  const resolved = await params
  const normalizedPartner = resolved.partner.trim().toLowerCase()
  const plainTitle = `${resolved.partner} Products`
  const metadata = buildPageMetadata({
    title: `${resolved.partner} Products`,
    description: `Browse all products for ${resolved.partner}.`,
    path: `/shop/${resolved.partner}/product`,
  })
  const partnerIcon = normalizedPartner === 'synergy-shop' ? '/Images/synergy.png' : undefined

  return {
    ...metadata,
    title: plainTitle,
    icons: partnerIcon
      ? {
        icon: [{ url: partnerIcon, type: 'image/png' }],
        apple: partnerIcon,
      }
      : metadata.icons,
    openGraph: metadata.openGraph
      ? {
        ...metadata.openGraph,
        title: plainTitle,
      }
      : undefined,
    twitter: metadata.twitter
      ? {
        ...metadata.twitter,
        title: plainTitle,
      }
      : undefined,
  }
}

async function fetchProductsByCategory(apiUrl: string, categoryId: number): Promise<Product[]> {
  const perPage = 200
  const collected: Product[] = []
  let page = 1
  let lastPage = 1

  try {
    while (page <= lastPage && page <= MAX_PRODUCT_PAGES_PER_CATEGORY) {
      const response = await fetchWithTimeout(`${apiUrl}/api/products?page=${page}&per_page=${perPage}&status=1&cat_id=${categoryId}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      })

      if (!response.ok) {
        break
      }

      const json = (await response.json()) as ApiProductsResponse
      collected.push(...(json.products ?? []))
      lastPage = Number(json.meta?.last_page ?? 1)
      if (!Number.isFinite(lastPage) || lastPage < 1) {
        lastPage = 1
      }
      page += 1
    }
  } catch {
    return collected
  }

  return collected
}

async function getPartnerProductPageData(partnerSlug: string) {
  const apiUrl = process.env.LARAVEL_API_URL ?? process.env.NEXT_PUBLIC_LARAVEL_API_URL
  if (!apiUrl) return null

  try {
    const [storefrontsRes, categoriesRes] = await Promise.all([
      fetchWithTimeout(`${apiUrl}/api/web-pages/partner-storefronts`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      }),
      fetchWithTimeout(`${apiUrl}/api/categories?used_only=1&per_page=300`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      }),
    ])

    if (!storefrontsRes.ok) {
      return {
        categories: [] as Category[],
        products: [] as CategoryProduct[],
      }
    }
    if (!categoriesRes.ok) {
      return {
        categories: [] as Category[],
        products: [] as CategoryProduct[],
      }
    }

    const storefrontsJson = (await storefrontsRes.json()) as ApiWebPagesResponse
    const categoriesJson = (await categoriesRes.json()) as ApiCategoriesResponse

    const storefrontItem = (storefrontsJson.items ?? []).find((item) => {
      const config = getPartnerStorefrontConfig(item)
      return config?.slug === partnerSlug
    })

    const partner = getPartnerStorefrontConfig(storefrontItem)
    if (!partner) return null

    const allowedCategories = filterPartnerCategories(categoriesJson.categories ?? [], partner)
    const selectedProductIdSet = new Set(partner.featuredProductIds)

    if (allowedCategories.length === 0) {
      return {
        categories: allowedCategories,
        products: [] as CategoryProduct[],
      }
    }

    if (selectedProductIdSet.size === 0) {
      return {
        categories: allowedCategories,
        products: [] as CategoryProduct[],
      }
    }

    const batches = await Promise.all(allowedCategories.map((category) => fetchProductsByCategory(apiUrl, category.id)))
    const uniqueProducts = Array.from(
      batches
        .flat()
        .reduce((map, product) => {
          map.set(product.id, product)
          return map
        }, new Map<number, Product>())
        .values(),
    )
    const selectedProducts = uniqueProducts.filter((product) => selectedProductIdSet.has(product.id))

    return {
      categories: allowedCategories,
      products: selectedProducts.map((product) => mapProductToDisplay(product, apiUrl)),
    }
  } catch {
    return {
      categories: [] as Category[],
      products: [] as CategoryProduct[],
    }
  }
}

export default async function PartnerProductPage({ params }: PageProps) {
  const resolved = await params
  if (resolved.partner.toLowerCase() === 'senergy-shop') {
    redirect('/shop/synergy-shop/product')
  }
  const payload = await getPartnerProductPageData(resolved.partner)

  if (!payload) {
    notFound()
  }

  return (
    <CategoryListProductMain
      slug={`${resolved.partner}-products`}
      initialCategoryLabel="All Products"
      initialProducts={payload.products}
      initialCategories={payload.categories}
    />
  )
}
