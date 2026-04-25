import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!apiSecret) {
    return NextResponse.json({ error: 'Cloudinary not configured.' }, { status: 500 })
  }

  try {
    const body = await req.json() as { params_to_sign?: Record<string, unknown> }
    const paramsToSign = body.params_to_sign ?? {}

    const paramsString = Object.keys(paramsToSign)
      .sort()
      .map((key) => `${key}=${String(paramsToSign[key])}`)
      .join('&')

    const signature = crypto
      .createHash('sha1')
      .update(paramsString + apiSecret)
      .digest('hex')

    return NextResponse.json({ signature })
  } catch {
    return NextResponse.json({ error: 'Failed to generate signature.' }, { status: 500 })
  }
}
