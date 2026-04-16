import { buildPageMetadata } from '@/app/seo'
import CompanyBranchesPageMain from '@/components/branches/CompanyBranchesPageMain'
import { getNavbarCategories } from '@/libs/serverStorefront'

export const metadata = buildPageMetadata({
  title: 'Our Branches',
  description: 'Find the nearest AF Home branch and open directions using Google Maps or Waze.',
  path: '/branches',
})

export default async function BranchesPage() {
  const navbarCategories = await getNavbarCategories()
  return <CompanyBranchesPageMain initialCategories={navbarCategories} />
}

