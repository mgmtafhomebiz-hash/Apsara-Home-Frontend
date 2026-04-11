import Image from 'next/image'
import Link from 'next/link'
import { buildPageMetadata } from '@/app/seo'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import TopBar from '@/components/layout/TopBar'
import TrustBar from '@/components/layout/TrustBar'
import type { Category } from '@/store/api/categoriesApi'
import type { Product } from '@/store/api/productsApi'
import type { WebPageItem } from '@/store/api/webPagesApi'
import { getNavbarCategories } from '@/libs/serverStorefront'

export const metadata = buildPageMetadata({
  title: 'Shop Redesign Preview',
  description: 'Preview a premium editorial redesign for the AF Home shop page.',
  path: '/redesign',
})

type ApiCategoriesResponse = { categories?: Category[] }
type ApiProductsResponse = { products?: Product[] }
type ApiWebPagesResponse = { items?: WebPageItem[] }
type ShopPreviewData = { categories: Category[]; products: Product[]; items: WebPageItem[] }

const FALLBACK_IMAGE = '/Images/HeroSection/chairs_stools.jpg'

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value || 0)

const productHref = (product: Product) => {
  const slug = String(product.name ?? 'product')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `/product/${slug}-i${product.id}`
}

const getProductImage = (product?: Product | null) =>
  product?.image || product?.images?.[0] || FALLBACK_IMAGE

const getProductPrice = (product?: Product | null) =>
  Number(product?.priceMember || product?.priceSrp || 0)

async function getShopPreviewData(): Promise<ShopPreviewData | null> {
  const apiUrl = process.env.LARAVEL_API_URL ?? process.env.NEXT_PUBLIC_LARAVEL_API_URL
  if (!apiUrl) return null
  try {
    const [webPagesRes, categoriesRes, productsRes] = await Promise.all([
      fetch(`${apiUrl}/api/web-pages/shop-builder`, { headers: { Accept: 'application/json' }, cache: 'no-store' }),
      fetch(`${apiUrl}/api/categories?page=1&per_page=100&used_only=1`, { headers: { Accept: 'application/json' }, cache: 'no-store' }),
      fetch(`${apiUrl}/api/products?page=1&per_page=100&status=1`, { headers: { Accept: 'application/json' }, cache: 'no-store' }),
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
  } catch { return null }
}

/* ─── Shared container ──────────────────────────────────────────────────────── */
const C = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-10'

/* ─── Minimal Product Card ──────────────────────────────────────────────────── */
function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={productHref(product)} className="group flex flex-col gap-3">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#ede8df]">
        <Image
          src={getProductImage(product)}
          alt={product.name}
          fill
          unoptimized
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {product.bestseller && (
          <span className="absolute left-3 top-3 rounded-full bg-[#1a1a1a] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
            Bestseller
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#9a9086]">{product.brand || 'AF Home'}</p>
        <p className="line-clamp-1 text-sm font-semibold text-[#1a1a1a]">{product.name}</p>
        <p className="text-sm font-bold text-[#1a1a1a]">{formatMoney(getProductPrice(product))}</p>
      </div>
    </Link>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════════ */
export default async function RedesignPreviewPage() {
  const [shopPreviewData, navbarCategories] = await Promise.all([
    getShopPreviewData(),
    getNavbarCategories(),
  ])

  const categories = shopPreviewData?.categories ?? []
  const products = shopPreviewData?.products ?? []

  const p = (i: number) => products[i] ?? null
  const categoryHighlights = categories.slice(0, 3)
  const newArrivals = products.slice(4, 8)
  const swatches = ['#d4c5b0', '#b8906a', '#7a6355', '#1a1a1a']

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f3ee', color: '#1a1a1a' }}>
      <TopBar />
      <Navbar initialCategories={navbarCategories} />
      <TrustBar />

      <main>

        {/* 1 · HERO */}
        <section className="pb-16 pt-10">
          <div className={C}>
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">

              {/* Left — text */}
              <div className="flex flex-col gap-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#9a9086]">
                  AF Home · New Collection
                </p>
                <h1 className="font-display text-[clamp(2.8rem,6vw,5.5rem)] font-bold leading-[1.05] text-[#1a1a1a]">
                  Elevate Your<br />Living Space<br />
                  <em className="not-italic" style={{ color: '#8b6f4e' }}>Beautifully.</em>
                </h1>
                <p className="max-w-xs text-sm leading-7 text-[#7a7065]">
                  Premium furniture crafted for the way you live — warm, considered, and built to last.
                </p>

                <div className="flex items-center gap-2.5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#9a9086]">Finish:</p>
                  {swatches.map((c, i) => (
                    <button
                      key={c}
                      className="h-6 w-6 rounded-full border-2 transition hover:scale-110"
                      style={{
                        backgroundColor: c,
                        borderColor: i === 1 ? '#1a1a1a' : 'transparent',
                        outline: i === 1 ? '2px solid #f7f3ee' : 'none',
                        outlineOffset: '2px',
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    href={p(0) ? productHref(p(0)!) : '/shop'}
                    className="rounded-full bg-[#1a1a1a] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#2e2e2e]"
                  >
                    Shop Now
                  </Link>
                  <Link href="/shop" className="flex items-center gap-2 text-sm font-semibold text-[#7a7065] transition hover:text-[#1a1a1a]">
                    Browse All <span>→</span>
                  </Link>
                </div>

                <div className="flex items-center gap-6 border-t border-[#e4ddd3] pt-5">
                  {[['10k+', 'Products'], ['500+', 'Brands'], ['Free', 'Delivery ₱5k+']].map(([n, l]) => (
                    <div key={l} className="flex flex-col gap-0.5">
                      <span className="font-display text-xl font-bold text-[#1a1a1a]">{n}</span>
                      <span className="text-[11px] text-[#9a9086]">{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — hero image */}
              <div className="relative">
                <div className="relative overflow-hidden rounded-3xl" style={{ aspectRatio: '4/4.5' }}>
                  <Image
                    src={getProductImage(p(0))}
                    alt={p(0)?.name || 'Hero furniture'}
                    fill
                    unoptimized
                    priority
                    className="object-cover"
                  />
                </div>

                <div className="absolute -bottom-4 -left-4 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-[#1a1a1a] text-white shadow-xl md:-left-6">
                  <span className="text-[10px] font-medium uppercase tracking-widest text-white/60">from</span>
                  <span className="font-display text-lg font-bold leading-tight">
                    {p(0) ? formatMoney(getProductPrice(p(0))).replace('PHP', '₱') : '₱5k'}
                  </span>
                </div>

                <div className="absolute -right-3 top-6 rounded-full border border-[#e4ddd3] bg-white/90 px-4 py-2 shadow-md backdrop-blur">
                  <p className="text-[11px] font-semibold text-[#1a1a1a]">
                    {categories[0]?.name || 'Living Room'}
                  </p>
                </div>

                <div className="mt-5 flex justify-center gap-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className="rounded-full"
                      style={{ width: i === 0 ? 24 : 8, height: 8, backgroundColor: i === 0 ? '#1a1a1a' : '#d4cec6' }}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2 · BRAND TAGLINE */}
        <section className="border-y border-[#e4ddd3] bg-white py-20 text-center">
          <div className={C}>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#9a9086]">
              The AF Home Difference
            </p>
            <h2 className="font-display mx-auto max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-tight text-[#1a1a1a]">
              Luxury of craft meets the art of design — for spaces that become stories worth telling.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-[#7a7065]">
              From statement sofas to intimate accent pieces, every product is curated for quality, proportion, and the warmth that makes a house feel like a home.
            </p>
          </div>
        </section>

        {/* 3 · ROOM SHOWCASE */}
        <section className="py-16">
          <div className={C}>
            <div className="mb-10 flex items-end justify-between">
              <h2 className="font-display text-3xl font-bold text-[#1a1a1a] md:text-4xl">Shop by Room</h2>
              <Link href="/shop" className="flex items-center gap-2 text-sm font-semibold text-[#7a7065] transition hover:text-[#1a1a1a]">
                View all <span>→</span>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {(categoryHighlights.length > 0
                ? categoryHighlights
                : [
                    { id: 1, name: 'Living Room', url: '', image: null, product_count: 0 },
                    { id: 2, name: 'Bedroom', url: '', image: null, product_count: 0 },
                    { id: 3, name: 'Dining', url: '', image: null, product_count: 0 },
                  ]
              ).map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/category/${'url' in cat && cat.url ? cat.url : cat.id}`}
                  className="group relative block overflow-hidden rounded-2xl"
                  style={{ aspectRatio: '3/4', backgroundColor: '#ede8df' }}
                >
                  <Image
                    src={'image' in cat && cat.image ? cat.image : getProductImage(p(i + 1))}
                    alt={cat.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="font-display text-2xl font-bold text-white">{cat.name}</p>
                    <p className="mt-1 text-[11px] font-medium text-white/70">
                      {'product_count' in cat ? cat.product_count || 0 : 0} items
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 4 · FEATURE SPLIT */}
        <section className="py-16">
          <div className={C}>
            <div className="grid items-center gap-12 lg:grid-cols-2">

              {/* Left — arched image */}
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-sm">
                  <div
                    className="relative mx-auto w-4/5 overflow-hidden"
                    style={{
                      aspectRatio: '3/4',
                      borderRadius: '50% 50% 12px 12px / 40% 40% 12px 12px',
                      backgroundColor: '#ede8df',
                    }}
                  >
                    <Image
                      src={getProductImage(p(3))}
                      alt={p(3)?.name || 'Featured piece'}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -right-4 bottom-12 rounded-2xl border border-[#e4ddd3] bg-white p-4 shadow-lg">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9a9086]">Featured</p>
                    <p className="mt-1 max-w-30 text-xs font-bold leading-snug text-[#1a1a1a]">{p(3)?.name || 'Premium Piece'}</p>
                    <p className="mt-1 text-sm font-bold text-[#8b6f4e]">{p(3) ? formatMoney(getProductPrice(p(3))) : '₱12,990'}</p>
                  </div>
                </div>
              </div>

              {/* Right — text */}
              <div className="flex flex-col gap-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#9a9086]">
                  What Makes Us Different
                </p>
                <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight text-[#1a1a1a]">
                  What Made Is<br />
                  <em className="not-italic" style={{ color: '#8b6f4e' }}>Our Life</em>
                </h2>
                <p className="max-w-sm text-sm leading-8 text-[#7a7065]">
                  Every piece in the AF Home collection tells a story of craft and intention — furniture designed not just to fill a room, but to define it. Quality materials, timeless forms, and warmth in every detail.
                </p>

                <div className="flex flex-col gap-3">
                  {['Premium materials, lasting quality', 'Curated by interior design experts', 'Delivered with care, every time'].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1a1a1a]">
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-sm text-[#4a4540]">{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/shop"
                  className="inline-flex w-fit items-center gap-3 rounded-full bg-[#1a1a1a] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#2e2e2e]"
                >
                  Start Exploring <span>→</span>
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* 5 · NEW ARRIVALS */}
        <section className="bg-white py-16">
          <div className={C}>
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#9a9086]">Just In</p>
                <h2 className="font-display text-3xl font-bold text-[#1a1a1a] md:text-4xl">New Arrivals</h2>
              </div>
              <Link href="/shop" className="flex items-center gap-2 text-sm font-semibold text-[#7a7065] transition hover:text-[#1a1a1a]">
                View all <span>→</span>
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(newArrivals.length > 0 ? newArrivals : products.slice(0, 4)).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* 6 · BESTSELLERS — horizontal scroll */}
        <section className="py-16">
          <div className={`${C} mb-8`}>
            <div className="flex items-end justify-between">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#9a9086]">Customer Favourites</p>
                <h2 className="font-display text-3xl font-bold text-[#1a1a1a] md:text-4xl">Bestsellers</h2>
              </div>
              <Link href="/shop" className="flex items-center gap-2 text-sm font-semibold text-[#7a7065] transition hover:text-[#1a1a1a]">
                See all <span>→</span>
              </Link>
            </div>
          </div>
          <div
            className="flex gap-5 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-10"
            style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
          >
            {products.slice(0, 8).map((product) => (
              <div key={product.id} className="w-52 shrink-0 md:w-64" style={{ scrollSnapAlign: 'start' }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>

        {/* 7 · PROMO BANNER */}
        <section className="py-8">
          <div className={C}>
            <div className="overflow-hidden rounded-3xl" style={{ backgroundColor: '#2c2118' }}>
              <div className="grid lg:grid-cols-2">
                <div className="flex flex-col justify-center gap-6 p-10 md:p-14">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: '#c9a87a' }}>
                    Limited Time
                  </p>
                  <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold leading-tight text-white">
                    Up to 30% off<br />
                    <em className="not-italic" style={{ color: '#c9a87a' }}>Selected Pieces.</em>
                  </h2>
                  <p className="max-w-sm text-sm leading-7" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    Handpicked furniture from our most-loved collections — now at our best prices. While stocks last.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-flex w-fit items-center gap-3 rounded-full px-7 py-3.5 text-sm font-semibold transition"
                    style={{ backgroundColor: '#c9a87a', color: '#1a1a1a' }}
                  >
                    Shop the Sale →
                  </Link>
                </div>
                <div className="relative hidden aspect-square lg:block">
                  <Image
                    src={getProductImage(p(2))}
                    alt="Promo piece"
                    fill
                    unoptimized
                    className="object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-linear-to-l from-transparent to-[#2c2118]/60" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8 · QUICK BROWSE */}
        <section className="py-12">
          <div className={C}>
            <p className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-[#9a9086]">
              Quick Browse
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {['Living Room', 'Bedroom', 'Dining', 'Workspace', 'Outdoor', 'Minimal', 'Warm Wood', 'Bestsellers', 'Under ₱10k', 'New In', 'Sets & Bundles'].map((chip) => (
                <Link
                  key={chip}
                  href="/shop"
                  className="rounded-full border border-[#ddd7ce] bg-white px-4 py-2 text-sm font-medium text-[#4a4540] transition hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white"
                >
                  {chip}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 9 · NEWSLETTER */}
        <section className="border-t border-[#e4ddd3] bg-white py-20 text-center">
          <div className={C}>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#9a9086]">Stay Updated</p>
            <h2 className="font-display mx-auto mb-3 max-w-lg text-3xl font-bold text-[#1a1a1a] md:text-4xl">
              Get first access to new arrivals & exclusive offers.
            </h2>
            <p className="mx-auto mb-8 max-w-md text-sm leading-7 text-[#7a7065]">
              Join 10,000+ subscribers who get weekly drops, member-only deals, and style inspiration.
            </p>
            <div className="mx-auto flex max-w-md overflow-hidden rounded-full border border-[#e4ddd3] bg-[#f7f3ee]">
              <input
                type="email"
                placeholder="Enter your email address"
                className="min-w-0 flex-1 bg-transparent px-6 py-3.5 text-sm text-[#1a1a1a] placeholder:text-[#9a9086] focus:outline-none"
              />
              <button className="shrink-0 rounded-full bg-[#1a1a1a] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#2e2e2e]">
                Subscribe
              </button>
            </div>
            <p className="mt-4 text-[11px] text-[#b0a89e]">No spam. Unsubscribe anytime.</p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
