import { buildPageMetadata } from '@/app/seo';
import AssemblyGuidesPageClient from '@/components/assembly/AssemblyGuidesPageClient';
import { readdir } from 'fs/promises';
import path from 'path';

export const metadata = buildPageMetadata({ title: 'Assembly', description: 'Browse the Assembly page on AF Home.', path: '/assembly' });
export const revalidate = 600;

type LocalAssemblyGuide = {
  id: string
  title: string
  folder: string
  href: string
}

function humanizeGuideName(fileName: string) {
  return fileName
    .replace(/\.pdf$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isNumericOnlyTitle(value: string) {
  return /^[0-9]+$/.test(value.trim())
}

async function collectAssemblyGuidePdfs(dirPath: string, relativeDir = ''): Promise<LocalAssemblyGuide[]> {
  const entries = await readdir(dirPath, { withFileTypes: true })
  const guides: LocalAssemblyGuide[] = []

  for (const entry of entries) {
    const absolutePath = path.join(dirPath, entry.name)
    const relativePath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name

    if (entry.isDirectory()) {
      const nested = await collectAssemblyGuidePdfs(absolutePath, relativePath)
      guides.push(...nested)
      continue
    }

    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.pdf')) {
      continue
    }

    const segments = relativePath.split(/[\\/]/)
    const folder = segments.length > 1 ? segments[segments.length - 2] : 'Assembly Guide'
    const encodedHref = '/' + ['All Assembly Guides', ...relativePath.split(/[\\/]/)].map(encodeURIComponent).join('/')
    const humanizedFileName = humanizeGuideName(entry.name)
    const humanizedFolder = humanizeGuideName(folder)

    guides.push({
      id: relativePath.toLowerCase(),
      title: isNumericOnlyTitle(humanizedFileName)
        ? `${humanizedFolder} Guide`
        : humanizedFileName,
      folder: humanizedFolder,
      href: encodedHref,
    })
  }

  return guides
}

export default async function AssemblyGuidesPage() {
  const baseDir = path.join(process.cwd(), 'public', 'All Assembly Guides')
  let localGuides: LocalAssemblyGuide[] = []

  try {
    localGuides = await collectAssemblyGuidePdfs(baseDir)
  } catch {
    localGuides = []
  }

  return (
    <AssemblyGuidesPageClient
      localGuides={localGuides.sort((a, b) => a.title.localeCompare(b.title))}
    />
  )
}
