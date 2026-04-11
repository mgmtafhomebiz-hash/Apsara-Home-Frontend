'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AiSupport } from './AiSupport'
import { getPartnerStorefrontConfig } from '@/libs/partnerStorefront'
import type { WebPageItem } from '@/store/api/webPagesApi'

type PublicWebPageItemsResponse = {
  items?: WebPageItem[]
}

const extractPartnerSlug = (pathname: string) => {
  const match = pathname.match(/^\/shop\/([^/?#]+)/)
  if (!match) return null

  const candidate = decodeURIComponent(match[1] ?? '').trim().toLowerCase()
  if (!candidate || candidate === 'category') return null
  return candidate
}

export default function ShopAiSupportGate() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin') || pathname.startsWith('/partner')) {
    return null
  }
  const partnerSlug = useMemo(() => extractPartnerSlug(pathname), [pathname])
  const [partnerAiVisible, setPartnerAiVisible] = useState(false)

  useEffect(() => {
    if (!partnerSlug) return

    let cancelled = false
    const apiUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL?.replace(/\/+$/, '')
    if (!apiUrl) {
      return
    }

    const run = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/web-pages/partner-storefronts`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        })

        if (!response.ok) {
          if (!cancelled) setPartnerAiVisible(false)
          return
        }

        const json = (await response.json()) as PublicWebPageItemsResponse
        const storefront = (json.items ?? []).find((item) => {
          const config = getPartnerStorefrontConfig(item)
          return config?.slug === partnerSlug
        })
        const config = getPartnerStorefrontConfig(storefront)

        if (!cancelled) {
          setPartnerAiVisible(Boolean(config?.enableAiSupport))
        }
      } catch {
        if (!cancelled) setPartnerAiVisible(false)
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [partnerSlug])

  if (!partnerSlug) return <AiSupport />
  if (!partnerAiVisible) return null
  return <AiSupport />
}
