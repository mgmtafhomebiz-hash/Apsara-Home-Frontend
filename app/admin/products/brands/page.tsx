import { buildPageMetadata } from '@/app/seo';
import BrandsPageMain from '@/components/superAdmin/products/brands/BrandsPageMain'

export const metadata = buildPageMetadata({ title: 'Admin Products Brands', description: 'Browse the Admin Products Brands page on AF Home.', path: '/admin/products/brands', noIndex: true });

export default function AdminProductsBrandsPage() {
  return <BrandsPageMain />
}
