import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import ScrollToTop from "@/components/landing-page/ScrollToTop";
import ProductPageClient from '@/components/product/ProductPageClient';
import ProductTabs from '@/components/product/ProductTabs';
import ProductPageWrapper from '@/components/product/ProductPageWrapper';
import RelatedProducts from '@/components/product/RelatedProduct';
import ProductQA from '@/components/product/ProductQA';
import CompleteTheLook from '@/components/product/CompleteTheLook';
import { buildPageMetadata } from '@/app/seo';
import { getNavbarCategories } from '@/libs/serverStorefront';
import { buildCanonicalProductSlug, getProductPageData } from '@/libs/productPageData';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ partner: string; slug: string }>
}

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

function PartnerOrderFooter({ partnerName }: { partnerName: string }) {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
        Orders from <span className="font-semibold text-slate-800">{partnerName}</span> are still processed through AF Home.
      </div>
    </footer>
  );
}

const toTitle = (value: string) =>
  value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || value

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { partner, slug } = await params
  const normalizedPartner = partner.trim().toLowerCase()

  if (normalizedPartner !== 'synergy-shop') {
    return buildPageMetadata({
      title: 'Product Details',
      description: 'Browse product details on AF Home.',
      path: `/${partner}/product/${slug}`,
    })
  }

  const data = await getProductPageData(slug)
  if (!data) {
    return buildPageMetadata({
      title: `${toTitle(partner)} Product`,
      description: `Browse ${toTitle(partner)} storefront products.`,
      path: `/${partner}/product`,
    })
  }

  const canonicalSlug = buildCanonicalProductSlug(data.product.name, data.product.id)
  const fallbackDescription = `Buy ${data.product.name} on ${toTitle(partner)}.`
  const safeDescription = (data.product.description || fallbackDescription).slice(0, 160)

  const baseMeta = buildPageMetadata({
    title: data.product.name,
    description: safeDescription,
    path: `/${normalizedPartner}/product/${canonicalSlug}`,
    siteName: 'Synergy Shop',
  })

  return {
    ...baseMeta,
    icons: {
      icon: [{ url: '/Images/synergy.png', type: 'image/png' }],
      apple: '/Images/synergy.png',
    },
  }
}

export default async function PartnerProductDetailPage({ params }: PageProps) {
  const { partner, slug } = await params
  const normalizedPartner = partner.trim().toLowerCase()
  if (normalizedPartner !== 'synergy-shop') {
    notFound()
  }

  const dynamicData = await getProductPageData(slug)
  if (!dynamicData) return notFound()
  const navbarCategories = await getNavbarCategories()

  const canonicalSlug = buildCanonicalProductSlug(dynamicData.product.name, dynamicData.product.id)
  if (slug !== canonicalSlug) {
    redirect(`/${normalizedPartner}/product/${canonicalSlug}`)
  }

  return (
    <ProductPageWrapper
      initialCategories={navbarCategories}
      hideTopBar
      logoSrc="/Images/synergy.png"
      logoAlt="Synergy Shop"
      logoHref="/synergy-shop/product"
      hideSignIn
      hideNavLinks
      stickToTop
      showGuestCartWishlist
    >
      <main className="flex-1 bg-white dark:bg-gray-900">
        <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
              <Link href="/synergy-shop/product" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors font-medium">Home</Link>
              <ChevronRight />
              <Link href={`/shop/${normalizedPartner}/category/${dynamicData.categorySlug}`} className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                {dynamicData.categoryLabel}
              </Link>
              <ChevronRight />
              <span className="text-slate-600 dark:text-gray-300 font-semibold truncate max-w-48">{dynamicData.product.name}</span>
            </nav>
          </div>
        </div>
        <div className="container mx-auto px-4 py-10">
          <ProductPageClient
            product={dynamicData.product}
            categoryLabel={dynamicData.categoryLabel}
            reviewSummary={dynamicData.reviewSummary}
            forceRealPrice
            allowGuestWishlist
          />
          <div className="border-t border-gray-200 dark:border-gray-700 pt-10 mt-10">
            <ProductTabs
              product={dynamicData.product}
              reviewSummary={dynamicData.reviewSummary}
              reviews={dynamicData.reviews ?? []}
            />
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-10 mt-10">
            <RelatedProducts products={dynamicData.relatedProducts} category={dynamicData.categorySlug} />
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-10 mt-10">
            <ProductQA />
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-10 mt-10">
            <CompleteTheLook
              currentCategory={dynamicData.categorySlug}
              currentCategoryId={dynamicData.categoryId}
              currentCategoryLabel={dynamicData.categoryLabel}
              currentProductId={dynamicData.product.id}
            />
          </div>
        </div>
      </main>
      <PartnerOrderFooter partnerName="Synergy Shop" />
      <ScrollToTop />
    </ProductPageWrapper>
  );
}
