import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export const runtime = 'nodejs'
export const maxDuration = 30

const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET

cloudinary.config({
  cloud_name: cloudinaryCloudName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
})

export async function POST(req: NextRequest) {
  try {
    if (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
      return NextResponse.json(
        { error: 'Cloudinary is not configured on this deployment.' },
        { status: 500 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folderType = String(formData.get('folder') ?? 'products').toLowerCase()
    const assetType = String(formData.get('asset_type') ?? 'image').toLowerCase()

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const isPdf = assetType === 'pdf'
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const allowedPdfTypes = ['application/pdf']
    const allowedTypes = isPdf ? allowedPdfTypes : allowedImageTypes
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: isPdf
          ? 'Invalid file type. Only PDF files are allowed.'
          : 'Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.',
      }, { status: 400 })
    }

    const maxSizeBytes = isPdf ? 20 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return NextResponse.json({
        error: isPdf
          ? 'File too large. Maximum size is 20MB for PDF files.'
          : 'File too large. Maximum size is 5MB.',
      }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    const folderMap: Record<string, string> = {
      products: 'apsara/products',
      encashment: 'apsara/encashment/proofs',
      verification: 'apsara/verification',
      profile: 'apsara/profile',
      'assembly-guides': 'apsara/assembly-guides',
    }
    const folder = folderMap[folderType] ?? folderMap.products

    const result = isPdf
      ? await cloudinary.uploader.upload(base64, {
          folder,
          resource_type: 'raw',
          use_filename: true,
          unique_filename: true,
        })
      : await cloudinary.uploader.upload(base64, {
          folder,
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        })

    return NextResponse.json({ url: result.secure_url, public_id: result.public_id })
  } catch (err: unknown) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
