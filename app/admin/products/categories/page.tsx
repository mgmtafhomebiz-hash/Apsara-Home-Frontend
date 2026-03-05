import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Admin Products Categories', description: 'Browse the Admin Products Categories page on AF Home.', path: '/admin/products/categories', noIndex: true });

import CategoriesPageMain from '@/components/superAdmin/products/categories/CategoriesPageMain'


export default function AdminCategoriesPage() {
  return <CategoriesPageMain />
}