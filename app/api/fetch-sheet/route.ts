import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sheetUrl = searchParams.get('url')

  if (!sheetUrl) {
    return NextResponse.json({ error: 'Missing url parameter.' }, { status: 400 })
  }

  const idMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  if (!idMatch) {
    return NextResponse.json({ error: 'Invalid Google Sheets URL.' }, { status: 400 })
  }

  const spreadsheetId = idMatch[1]
  const gidMatch = sheetUrl.match(/[?&#]gid=(\d+)/)
  const gid = gidMatch ? gidMatch[1] : '0'
  const exportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`

  try {
    const response = await fetch(exportUrl)
    if (!response.ok) {
      return NextResponse.json(
        { error: `Google Sheets returned ${response.status}. Make sure the sheet is shared as "Anyone with the link can view".` },
        { status: 502 },
      )
    }

    const csv = await response.text()
    return new NextResponse(csv, {
      status: 200,
      headers: { 'Content-Type': 'text/csv; charset=utf-8' },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to reach Google Sheets. Check the URL and try again.' }, { status: 502 })
  }
}
