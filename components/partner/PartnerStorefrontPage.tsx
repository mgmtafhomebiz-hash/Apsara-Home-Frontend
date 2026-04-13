'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import ShopBuilderSections, { type ShopBuilderApiResponse } from '@/components/sections/ShopBuilderSections'
import type { PartnerStorefrontConfig } from '@/libs/partnerStorefront'

type Props = {
  partner: PartnerStorefrontConfig
  data: ShopBuilderApiResponse | null
}

export default function PartnerStorefrontPage({ partner, data }: Props) {
  const titleColor = partner.slug === 'synergy-shop' ? '#0b77b7' : partner.themeColor

  useEffect(() => {
    if (!partner.logoUrl) return

    const setIcon = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
      if (!link) {
        link = document.createElement('link')
        link.rel = rel
        document.head.appendChild(link)
      }
      link.href = href
    }

    setIcon('icon', partner.logoUrl)
    setIcon('apple-touch-icon', partner.logoUrl)

    if (partner.displayName) {
      document.title = `${partner.displayName} Shop`
    }
  }, [partner.displayName, partner.logoUrl])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section
        className="border-b border-slate-200"
        style={{
          background: `linear-gradient(135deg, ${partner.themeColor} 0%, ${partner.accentColor} 100%)`,
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 rounded-[28px] bg-white/92 p-5 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between md:p-6">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-24 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:h-24 sm:w-28">
                {partner.logoUrl ? (
                  <img
                    src={partner.logoUrl}
                    alt={partner.displayName}
                    className="h-full w-full object-contain p-2.5 sm:p-3"
                  />
                ) : (
                  <span className="text-xl font-bold text-slate-700">{partner.displayName.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Partner Store</p>
                <h1
                  className="text-2xl font-bold tracking-tight sm:text-3xl"
                  style={{ color: titleColor }}
                >
                  {partner.heroTitle}
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-slate-600">{partner.heroSubtitle}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/shop/${partner.slug}`}
                className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm"
                style={{ backgroundColor: partner.themeColor }}
              >
                Browse Store
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700"
              >
                Main Synergy Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ShopBuilderSections data={data} partnerSlug={partner.slug} />

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>
            Orders from <span className="font-semibold text-slate-800">{partner.displayName}</span> are still processed through AF Home.
          </p>
          {partner.notificationEmail ? <p>Partner notifications: {partner.notificationEmail}</p> : null}
        </div>
      </footer>
    </div>
  )
}
