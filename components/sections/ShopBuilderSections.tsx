'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import HeroSection from './HeroSection'
import FeaturedSections from './FeaturedSections'
import PromoBenners from './PromoBenners'
import NewsLetter from './NewsLetter'
import ProductCard from '../ui/ProductCard'
import ShopCategoryCarousel from './ShopCategoryCarousel'
import ShopNewsletterSignup from './ShopNewsletterSignup'
import type { Category } from '@/store/api/categoriesApi'
import type { Product } from '@/store/api/productsApi'
import type { WebPageItem } from '@/store/api/webPagesApi'
import { buildPartnerCategoryLink, buildPartnerShopLink } from '@/libs/partnerStorefront'

type ShopSectionPayload = {
  fields?: Record<string, string>
}

const fallbackImage = '/Images/HeroSection/chairs_stools.jpg'
const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
}

const getItemByKey = (items: WebPageItem[], key: string) =>
  items.find((item) => String(item.key ?? '').trim() === key)

const getField = (item: WebPageItem | undefined, key: string) =>
  (((item?.payload ?? {}) as ShopSectionPayload).fields ?? {})[key] ?? ''

const parseIdList = (value: string) =>
  value
    .split(',')
    .map((item) => Number.parseInt(item.trim(), 10))
    .filter((item) => Number.isFinite(item) && item > 0)

const slugifyProductName = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const buildProductLink = (product: Pick<Product, 'id' | 'name'>) =>
  `/product/${slugifyProductName(product.name)}-i${product.id}`

const getFeaturedProducts = (featuredCollection: WebPageItem | undefined, products: Product[]) => {
  const sourceCategoryId = Number.parseInt(getField(featuredCollection, 'source_category_id'), 10)
  const categoryProducts = Number.isFinite(sourceCategoryId) && sourceCategoryId > 0
    ? products.filter((item) => item.catid === sourceCategoryId)
    : []

  if (categoryProducts.length > 0) {
    return categoryProducts.slice(0, 4)
  }

  return parseIdList(getField(featuredCollection, 'product_ids'))
    .map((id) => products.find((item) => item.id === id))
    .filter((item): item is Product => Boolean(item))
    .slice(0, 4)
}

const resolveCategoryCardImage = ({
  section,
  categoryId,
  slotIndex,
  categoryImage,
}: {
  section: WebPageItem | undefined
  categoryId: number
  slotIndex?: number
  categoryImage?: string | null
}) =>
  getField(section, `category_image_${categoryId}`) ||
  (typeof slotIndex === 'number' ? getField(section, `card_${slotIndex + 1}_image`) : '') ||
  categoryImage ||
  fallbackImage

export type ShopBuilderSectionsData = {
  items: WebPageItem[]
  categories: Category[]
  products: Product[]
} | null

export type ShopBuilderSectionsProps = {
  data?: ShopBuilderSectionsData
  partnerSlug?: string
  allowedCategoryIds?: number[]
}

export type ShopBuilderApiResponse = {
  items: WebPageItem[]
  categories: Category[]
  products: Product[]
}

export function normalizeShopBuilderApiResponse(data: ShopBuilderApiResponse | null | undefined) {
  return {
    items: data?.items ?? [],
    categories: data?.categories ?? [],
    products: data?.products ?? [],
  }
}

export default function ShopBuilderSections({ data = null, partnerSlug, allowedCategoryIds }: ShopBuilderSectionsProps) {
  const { items, categories, products } = normalizeShopBuilderApiResponse(data)

  if (!data || items.length === 0) {
    return (
      <>
        <HeroSection />
        <FeaturedSections />
        <PromoBenners />
        <NewsLetter />
      </>
    )
  }

  const announcements = getItemByKey(items, 'announcements')
  const campaignBanners = getItemByKey(items, 'campaign-banners')
  const categoryGrid = getItemByKey(items, 'category-grid')
  const featuredCollection = getItemByKey(items, 'featured-collection')
  const promoPair = getItemByKey(items, 'promo-pair')
  const newsletter = getItemByKey(items, 'newsletter')

  const selectedCategoryCards = parseIdList(getField(categoryGrid, 'category_ids'))
    .map((id, index) => {
      const category = categories.find((item) => item.id === id)
      if (!category) return null
      return {
        id: category.id,
        name: category.name,
        url: buildPartnerCategoryLink(partnerSlug, category),
        count: category.product_count ?? 0,
        image: resolveCategoryCardImage({
          section: categoryGrid,
          categoryId: category.id,
          slotIndex: index,
          categoryImage: category.image,
        }),
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  const partnerAllowedIds = partnerSlug ? (allowedCategoryIds ?? []) : []
  const partnerAllowedSet = new Set(partnerAllowedIds)
  const partnerCategoryCards = partnerSlug
    ? categories
      .filter((category) => partnerAllowedSet.has(category.id))
      .map((category, index) => ({
        id: category.id,
        name: category.name,
        url: buildPartnerCategoryLink(partnerSlug, category),
        count: category.product_count ?? 0,
        image: resolveCategoryCardImage({
          section: categoryGrid,
          categoryId: category.id,
          slotIndex: index,
          categoryImage: category.image,
        }),
      }))
    : []

  const allCategoryCards = partnerSlug ? partnerCategoryCards : selectedCategoryCards

  const featuredProducts = getFeaturedProducts(featuredCollection, products)

  return (
    <>
      {announcements ? <AnnouncementsSection section={announcements} /> : null}
      {campaignBanners ? <CampaignBannersSection section={campaignBanners} categories={categories} products={products} partnerSlug={partnerSlug} /> : null}

      {categoryGrid && allCategoryCards.length > 0 && (!partnerSlug || partnerAllowedIds.length > 0) ? (
        <CategoryGridSection
          section={categoryGrid}
          categoryCards={allCategoryCards}
          partnerSlug={partnerSlug}
        />
      ) : partnerSlug ? null : (
        <HeroSection />
      )}

      {featuredCollection ? (
        <FeaturedCollectionSection
          section={featuredCollection}
          featuredProducts={featuredProducts}
          categories={categories}
          partnerSlug={partnerSlug}
        />
      ) : (
        <FeaturedSections />
      )}

      {promoPair ? <PromoPairSection section={promoPair} partnerSlug={partnerSlug} /> : <PromoBenners />}
      {newsletter ? <NewsletterSection section={newsletter} /> : <NewsLetter />}
    </>
  )
}

function AnnouncementsSection({ section }: { section: WebPageItem }) {
  const chips = getField(section, 'chip_group').split(',').map((item) => item.trim()).filter(Boolean)
  if (chips.length === 0) return null

  return (
    <motion.section
      {...fadeUp}
      transition={{ duration: 0.45 }}
      className="!bg-white dark:!bg-gray-900"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="rounded-2xl border border-orange-100 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20 px-3 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <AnimatePresence initial={false}>
              {chips.map((item, index) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, scale: 0.92, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -8 }}
                  transition={{ duration: 0.22, delay: index * 0.04 }}
                  className="inline-flex rounded-full border border-orange-100 dark:border-orange-800 bg-white dark:bg-gray-800 px-3 py-1 text-xs font-semibold text-orange-700 dark:text-orange-400"
                >
                  {item}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

function CampaignBannersSection({
  section,
  categories,
  products,
  partnerSlug,
}: {
  section: WebPageItem
  categories: Category[]
  products: Product[]
  partnerSlug?: string
}) {
  const videoUrl = getField(section, 'video_url')
  const posterUrl = getField(section, 'video_poster') || fallbackImage
  const eyebrow = getField(section, 'video_eyebrow') || 'Top Promos'
  const title = getField(section, 'video_title') || 'Weekend Furniture Drop'
  const subtitle = getField(section, 'video_subtitle') || 'Refresh your living room this week'
  const buttonText = getField(section, 'video_button') || 'Explore Now'
  const linkType = getField(section, 'link_type') || 'category'
  const linkCategoryId = Number.parseInt(getField(section, 'link_category_id'), 10)
  const linkProductId = Number.parseInt(getField(section, 'link_product_id'), 10)
  const linkCategory = Number.isFinite(linkCategoryId) && linkCategoryId > 0
    ? categories.find((category) => category.id === linkCategoryId)
    : undefined
  const linkProduct = Number.isFinite(linkProductId) && linkProductId > 0
    ? products.find((product) => product.id === linkProductId)
    : undefined
  const link = linkType === 'product' && linkProduct
    ? buildProductLink(linkProduct)
    : linkType === 'category' && linkCategory
      ? buildPartnerCategoryLink(partnerSlug, linkCategory)
      : buildPartnerShopLink(getField(section, 'video_link') || '/shop', partnerSlug)

  return (
    <motion.section
      {...fadeUp}
      transition={{ duration: 0.5, delay: 0.04 }}
      className="!bg-white dark:!bg-gray-900 container mx-auto px-4 py-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 26, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
      >
        <Link href={link} className="group relative block overflow-hidden rounded-[32px] border border-slate-200 dark:border-gray-700 bg-slate-950 shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
          <div className="relative aspect-[21/8] min-h-[240px] w-full md:min-h-[300px]">
            {videoUrl ? (
              <video
                src={videoUrl}
                poster={posterUrl}
                className="absolute inset-0 h-full w-full scale-[1.06] object-cover object-center transition-transform duration-700 group-hover:scale-[1.1]"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <Image
                src={posterUrl}
                alt={title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                unoptimized
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/45 to-slate-950/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
            <div className="relative flex h-full items-end p-6 md:p-8">
              <div className="max-w-xl text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300">
                  {eyebrow}
                </p>
                <h2 className="mt-3 text-2xl font-bold leading-tight md:text-4xl">
                  {title}
                </h2>
                <p className="mt-3 max-w-lg text-sm text-white/80 md:text-base">
                  {subtitle}
                </p>
                <span className="mt-5 inline-flex rounded-xl bg-white/12 px-5 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/20 backdrop-blur-sm transition group-hover:bg-white/18">
                  {buttonText}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.section>
  )
}

function CategoryGridSection({
  section,
  categoryCards,
  partnerSlug,
}: {
  section: WebPageItem
  categoryCards: Array<{ id: number; name: string; url: string; count: number; image: string }>
  partnerSlug?: string
}) {
  const cards = categoryCards

  return (
    <motion.section
      {...fadeUp}
      transition={{ duration: 0.5, delay: 0.08 }}
      className="!bg-white dark:!bg-gray-900 container mx-auto px-4 py-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.45 }}
        className="mb-8 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.35 }}
          className="mb-2 text-sm font-semibold uppercase tracking-widest text-orange-500"
        >
          {getField(section, 'eyebrow') || 'Shop by Category'}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="text-3xl font-bold text-slate-900 dark:text-gray-100 md:text-4xl"
        >
          {getField(section, 'heading') || 'Find Your Perfect Furniture'}
        </motion.h2>
      </motion.div>

      <ShopCategoryCarousel cards={cards} />
    </motion.section>
  )
}

function FeaturedCollectionSection({
  section,
  featuredProducts,
  categories,
  partnerSlug,
}: {
  section: WebPageItem
  featuredProducts: Product[]
  categories: Category[]
  partnerSlug?: string
}) {
  const sourceCategoryId = Number.parseInt(getField(section, 'source_category_id'), 10)
  const sourceCategory = Number.isFinite(sourceCategoryId) && sourceCategoryId > 0
    ? categories.find((category) => category.id === sourceCategoryId)
    : undefined
  const buttonLink = sourceCategory
    ? buildPartnerCategoryLink(partnerSlug, sourceCategory)
    : buildPartnerShopLink(getField(section, 'lead_link') || '/shop', partnerSlug)
  const buttonText = section.button_text || 'Shop Collection'

  return (
    <motion.section
      {...fadeUp}
      transition={{ duration: 0.55, delay: 0.1 }}
      className="!bg-gray-50 dark:!bg-gray-900 py-16"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -34 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
          >
            <Link href={buttonLink} className="group relative block aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src={getField(section, 'lead_image') || '/Images/FeaturedSection/home_living.jpg'}
              alt={getField(section, 'left_heading') || 'Featured collection'}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-orange-300">
                {getField(section, 'left_eyebrow') || 'Featured'}
              </p>
              <h2 className="mb-3 text-3xl font-bold leading-tight text-white">
                {getField(section, 'left_heading') || 'Minimal & Simple Design'}
              </h2>
              <p className="mb-5 text-sm text-white/60">
                {getField(section, 'left_description') || 'Crafted for the modern home.'}
              </p>
              <span className="inline-flex rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white">
                {buttonText}
              </span>
            </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 34 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: 0.06 }}
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-500">
              {getField(section, 'right_eyebrow') || 'Sale Items'}
            </p>
            <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-gray-100">
              {getField(section, 'right_heading') || 'Top Picks This Week'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {featuredProducts.length > 0 ? (
                <AnimatePresence initial={false}>
                  {featuredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                    >
                      <ProductCard
                        id={product.id}
                        name={product.name}
                        price={product.priceSrp}
                        priceMember={product.priceMember}
                        prodpv={product.prodpv}
                        image={product.image || fallbackImage}
                        stock={product.qty}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                [1, 2, 3, 4].map((index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="rounded-2xl bg-white dark:bg-gray-800 p-3 shadow-sm"
                  >
                    <div className="aspect-square rounded-2xl bg-gradient-to-br from-slate-100 to-white dark:from-gray-700 dark:to-gray-800" />
                    <p className="mt-3 text-sm font-medium text-gray-800 dark:text-gray-200">Select product IDs in Shop Builder</p>
                    <p className="mt-1 text-base font-bold text-orange-500">PHP 0</p>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

function PromoPairSection({ section, partnerSlug }: { section: WebPageItem; partnerSlug?: string }) {
  const promos = [
    {
      eyebrow: getField(section, 'left_eyebrow') || 'Limited Offer',
      heading: getField(section, 'left_heading') || 'Build Your Home with Furniture',
      button: getField(section, 'left_button') || 'Shop Now',
      image: getField(section, 'left_image') || '/Images/PromoBanners/ct2-img1-large.jpg',
      link: buildPartnerShopLink(getField(section, 'left_link') || '/shop', partnerSlug),
      badge: 'text-orange-300',
      tone: 'from-slate-900/90 via-slate-900/40 to-transparent',
    },
    {
      eyebrow: getField(section, 'right_eyebrow') || 'New Collection',
      heading: getField(section, 'right_heading') || 'Choose Your Best Appliance',
      button: getField(section, 'right_button') || 'Explore',
      image: getField(section, 'right_image') || '/Images/PromoBanners/ct2-img2-large.jpg',
      link: buildPartnerShopLink(getField(section, 'right_link') || '/shop', partnerSlug),
      badge: 'text-sky-300',
      tone: 'from-sky-900/90 via-sky-900/40 to-transparent',
    },
  ]

  return (
    <motion.section
      {...fadeUp}
      transition={{ duration: 0.5, delay: 0.14 }}
      className="!bg-white dark:!bg-gray-900 container mx-auto px-4 py-12"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AnimatePresence initial={false}>
          {promos.map((promo, index) => (
            <motion.div
              key={`${promo.heading}-${promo.image}`}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.42, delay: index * 0.08 }}
            >
              <Link href={promo.link} className="group relative block h-96 overflow-hidden rounded-3xl">
            <Image src={promo.image} alt={promo.heading} fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
            <div className={`absolute inset-0 bg-gradient-to-t ${promo.tone}`} />
            <div className="absolute inset-0 p-8">
              <div className="flex h-full flex-col justify-end">
                <p className={`mb-2 text-xs font-semibold uppercase tracking-widest ${promo.badge}`}>{promo.eyebrow}</p>
                <h3 className="mb-5 text-2xl font-bold leading-tight text-white">{promo.heading}</h3>
                <span className="inline-flex w-fit rounded-xl bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm">
                  {promo.button}
                </span>
              </div>
            </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}

function NewsletterSection({ section }: { section: WebPageItem }) {
  return (
    <ShopNewsletterSignup
      badge={getField(section, 'badge') || 'Newsletter'}
      heading={getField(section, 'heading') || 'Stay in the Loop'}
      description={getField(section, 'description') || 'Get exclusive deals, new arrivals and interior tips to your inbox.'}
      button={getField(section, 'button') || 'Subscribe'}
    />
  )
}
