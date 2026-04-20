import { NextResponse, NextRequest } from 'next/server'
import { proxy, config as proxyConfig } from './proxy'

const SUBDOMAIN_ROUTES: Record<string, string> = {
  ranking: '/ranking',
}

export async function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') ?? ''
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'afhome.ph'

  const subdomain = hostname.endsWith(`.${rootDomain}`)
    ? hostname.slice(0, hostname.length - rootDomain.length - 1)
    : null

  if (subdomain && SUBDOMAIN_ROUTES[subdomain]) {
    const targetPath = SUBDOMAIN_ROUTES[subdomain]
    const url = req.nextUrl.clone()

    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = targetPath
      return NextResponse.rewrite(url)
    }

    if (!url.pathname.startsWith(targetPath)) {
      url.pathname = targetPath + url.pathname
      return NextResponse.rewrite(url)
    }
  }

  return proxy(req)
}

export const config = {
  matcher: [
    ...proxyConfig.matcher,
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
