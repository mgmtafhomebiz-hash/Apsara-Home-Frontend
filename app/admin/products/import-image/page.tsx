import { buildPageMetadata } from '@/app/seo'
import ImportImagePageMain from '@/components/superAdmin/products/ImportImagePageMain'

export const metadata = buildPageMetadata({
  title: 'Import Image',
  description: 'Upload product images to Cloudinary and copy the resulting URLs.',
  path: '/admin/products/import-image',
  noIndex: true,
})

export default function AdminImportImagePage() {
  return <ImportImagePageMain />
}
