import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Shop', description: 'Browse the Shop page on AF Home.', path: '/shop' });

import Footer from "@/components/landing-page/Footer"
import ScrollToTop from "@/components/landing-page/ScrollToTop"
import Navbar from "@/components/layout/Navbar"
import TopBar from "@/components/layout/TopBar"
import TrustBar from "@/components/layout/TrustBar"
import AdsPopup from "@/components/shop/AdsPopup"
import ShopBuilderSections, { type ShopBuilderApiResponse } from "@/components/sections/ShopBuilderSections"
import { getNavbarCategories } from '@/libs/serverStorefront'
import type { TopBarConfig } from '@/components/layout/TopBar'
import type { TrustBarConfig } from '@/components/layout/TrustBar'

type ApiCategoriesResponse = {
  categories?: ShopBuilderApiResponse['categories']
}

type ApiProductsResponse = {
  products?: ShopBuilderApiResponse['products']
}

type ApiWebPagesResponse = {
  items?: ShopBuilderApiResponse['items']
}

const getItemByKey = (items: ShopBuilderApiResponse['items'], key: string) =>
  items.find((item) => String(item.key ?? '').trim() === key)

const getField = (item: ShopBuilderApiResponse['items'][number] | undefined, key: string) =>
  (((item?.payload ?? {}) as { fields?: Record<string, string> }).fields ?? {})[key] ?? ''

const parseList = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

const getShopHeaderConfig = (items: ShopBuilderApiResponse['items']) => {
  const shopHeader = getItemByKey(items, 'shop-header')

  const topBar: TopBarConfig = {
    phone: getField(shopHeader, 'contact_phone') || '+63 912 345 6789',
    email: getField(shopHeader, 'contact_email') || 'hello@afhome.ph',
    messages: parseList(getField(shopHeader, 'marquee_messages')),
    facebookLabel: getField(shopHeader, 'facebook_label') || 'FB',
    facebookUrl: getField(shopHeader, 'facebook_url') || '#',
    instagramLabel: getField(shopHeader, 'instagram_label') || 'IG',
    instagramUrl: getField(shopHeader, 'instagram_url') || '#',
    tiktokLabel: getField(shopHeader, 'tiktok_label') || 'TikTok',
    tiktokUrl: getField(shopHeader, 'tiktok_url') || '#',
  }

  const trustBar: TrustBarConfig = {
    items: [1, 2, 3, 4]
      .map((index) => ({
        title: getField(shopHeader, `trust_item_${index}_title`),
        desc: getField(shopHeader, `trust_item_${index}_desc`),
      }))
      .filter((item) => item.title || item.desc),
  }

  return { topBar, trustBar }
}

async function getShopBuilderData(): Promise<ShopBuilderApiResponse | null> {
  const apiUrl = process.env.LARAVEL_API_URL ?? process.env.NEXT_PUBLIC_LARAVEL_API_URL
  if (!apiUrl) return null

  try {
    const [webPagesRes, categoriesRes, productsRes] = await Promise.all([
      fetch(`${apiUrl}/api/web-pages/shop-builder`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      }),
      fetch(`${apiUrl}/api/categories?page=1&per_page=100&used_only=1`, {
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

    if (!webPagesRes.ok || !categoriesRes.ok || !productsRes.ok) return null

    const webPagesJson = (await webPagesRes.json()) as ApiWebPagesResponse
    const categoriesJson = (await categoriesRes.json()) as ApiCategoriesResponse
    const productsJson = (await productsRes.json()) as ApiProductsResponse

    return {
      items: webPagesJson.items ?? [],
      categories: categoriesJson.categories ?? [],
      products: productsJson.products ?? [],
    }
  } catch {
    return null
  }
}

const ShopPage = async () => {
  const shopBuilderData = await getShopBuilderData()
  const navbarCategories = await getNavbarCategories()
  const shopHeader = getShopHeaderConfig(shopBuilderData?.items ?? [])

  return (
    <div>
      <TopBar {...shopHeader.topBar} />
      <Navbar initialCategories={navbarCategories} />
      <TrustBar {...shopHeader.trustBar} />
      <AdsPopup />
      <ShopBuilderSections data={shopBuilderData} />
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default ShopPage
