import { notFound } from 'next/navigation'
import PartnerStorefrontPage from '@/components/partner/PartnerStorefrontPage'
import { filterPartnerCategories, filterPartnerProducts, getPartnerStorefrontConfig } from '@/libs/partnerStorefront'
import type { Category } from '@/store/api/categoriesApi'
import type { Product } from '@/store/api/productsApi'
import type { WebPageItem } from '@/store/api/webPagesApi'
import type { Metadata } from 'next'

type PageProps = {
  params: Promise<{
    partner: string
  }>
  searchParams?: Promise<{
    category?: string
  }>
}

type ApiCategoriesResponse = {
  categories?: Category[]
}

type ApiProductsResponse = {
  products?: Product[]
}

type ApiWebPagesResponse = {
  items?: WebPageItem[]
}

export async function generateMetadata({ params }: PageProps) {
  const resolved = await params
  const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://afhome.ph'
  const SITE_URL = RAW_SITE_URL.startsWith('http') ? RAW_SITE_URL : `https://${RAW_SITE_URL}`
  const title = `${resolved.partner} Shop`
  const description = `Browse the curated storefront for ${resolved.partner}.`
  const path = `/shop/${resolved.partner}`
  const canonicalUrl = `${SITE_URL}${path}`
  const isSynergy = resolved.partner.toLowerCase() === 'synergy-shop'

  const metadata: Metadata = {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'AF Home',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }

  if (isSynergy) {
    metadata.icons = {
      icon: [{ url: '/Images/synergy.png', type: 'image/png' }],
      apple: '/Images/synergy.png',
    }
  }

  return metadata
}

async function getPartnerStorefrontData(partnerSlug: string, selectedCategoryId?: number) {
  const apiUrl = process.env.LARAVEL_API_URL ?? process.env.NEXT_PUBLIC_LARAVEL_API_URL
  if (!apiUrl) return null

  try {
    const [storefrontsRes, webPagesRes, categoriesRes, productsRes] = await Promise.all([
      fetch(`${apiUrl}/api/web-pages/partner-storefronts`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      }),
      fetch(`${apiUrl}/api/web-pages/shop-builder`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      }),
      fetch(`${apiUrl}/api/categories?used_only=1`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      }),
      fetch(`${apiUrl}/api/products?page=1&per_page=200&status=1`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      }),
    ])

    if (!storefrontsRes.ok || !webPagesRes.ok || !categoriesRes.ok || !productsRes.ok) return null

    const storefrontsJson = (await storefrontsRes.json()) as ApiWebPagesResponse
    const webPagesJson = (await webPagesRes.json()) as ApiWebPagesResponse
    const categoriesJson = (await categoriesRes.json()) as ApiCategoriesResponse
    const productsJson = (await productsRes.json()) as ApiProductsResponse

    const storefrontItem = (storefrontsJson.items ?? []).find((item) => {
      const config = getPartnerStorefrontConfig(item)
      return config?.slug === partnerSlug
    })
    const partner = getPartnerStorefrontConfig(storefrontItem)
    if (!partner) return null

    const categories = filterPartnerCategories(categoriesJson.categories ?? [], partner)
    const products = filterPartnerProducts(productsJson.products ?? [], partner)
    const selectedProducts = selectedCategoryId
      ? products.filter((product) => product.catid === selectedCategoryId)
      : products

    return {
      partner,
      data: {
        items: webPagesJson.items ?? [],
        categories,
        products: selectedProducts,
      },
    }
  } catch {
    return null
  }
}

export default async function PartnerShopPage({ params, searchParams }: PageProps) {
  const resolved = await params
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const selectedCategoryId = Number.parseInt(String(resolvedSearchParams?.category ?? ''), 10)
  const payload = await getPartnerStorefrontData(
    resolved.partner,
    Number.isFinite(selectedCategoryId) && selectedCategoryId > 0 ? selectedCategoryId : undefined,
  )

  if (!payload) {
    notFound()
  }

  return <PartnerStorefrontPage partner={payload.partner} data={payload.data} />
}
