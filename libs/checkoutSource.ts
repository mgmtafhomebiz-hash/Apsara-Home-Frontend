export interface CheckoutSourceMeta {
  sourceLabel?: string | null
  sourceSlug?: string | null
  sourceHost?: string | null
  sourceUrl?: string | null
}

const DEFAULT_HOSTS = new Set([
  'afhome.ph',
  'www.afhome.ph',
  'localhost',
  '127.0.0.1',
])

function normalizeHost(value: string): string | null {
  const trimmed = value.trim().toLowerCase()
  return trimmed ? trimmed : null
}

function normalizePath(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return '/'
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

function toDisplayLabel(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function resolveCheckoutSource(pathname?: string | null): CheckoutSourceMeta {
  if (typeof window === 'undefined') {
    return {}
  }

  const host = normalizeHost(window.location.hostname)
  const currentPath = normalizePath(pathname ?? window.location.pathname ?? '/')
  const storefrontMatch = currentPath.match(/^\/shop\/([^/?#]+)/i)
  const storefrontSlug = storefrontMatch?.[1]?.trim().toLowerCase() || null
  const currentUrl = window.location.href || null

  if (storefrontSlug) {
    return {
      sourceLabel: toDisplayLabel(storefrontSlug),
      sourceSlug: storefrontSlug,
      sourceHost: host,
      sourceUrl: currentUrl,
    }
  }

  if (host && !DEFAULT_HOSTS.has(host)) {
    return {
      sourceLabel: host,
      sourceSlug: null,
      sourceHost: host,
      sourceUrl: currentUrl,
    }
  }

  return {
    sourceLabel: null,
    sourceSlug: null,
    sourceHost: host,
    sourceUrl: currentUrl,
  }
}
