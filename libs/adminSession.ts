'use client'

async function getPortalCsrfToken(portal: 'admin' | 'partner'): Promise<string | null> {
  try {
    const response = await fetch(`/api/${portal}/auth/csrf`, {
      method: 'GET',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) return null

    const data = (await response.json()) as { csrfToken?: string }
    return typeof data.csrfToken === 'string' && data.csrfToken.trim() !== ''
      ? data.csrfToken
      : null
  } catch {
    return null
  }
}

async function clearPortalSession(portal: 'admin' | 'partner', callbackUrl: string): Promise<void> {
  const csrfToken = await getPortalCsrfToken(portal)
  if (!csrfToken) return

  const body = new URLSearchParams({
    csrfToken,
    json: 'true',
    callbackUrl,
  })

  try {
    await fetch(`/api/${portal}/auth/signout`, {
      method: 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })
  } catch {
    // Best-effort cleanup only.
  }
}

export async function clearAdminSession(callbackUrl: string = '/admin/login'): Promise<void> {
  await clearPortalSession('admin', callbackUrl)
}

export async function clearPartnerSession(callbackUrl: string = '/partner/login'): Promise<void> {
  await clearPortalSession('partner', callbackUrl)
}
