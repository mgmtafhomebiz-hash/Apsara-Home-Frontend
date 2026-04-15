import { buildPageMetadata } from '@/app/seo'
import ByBrandPageMain from '@/components/brand/ByBrandPageMain'
import TopBar from '@/components/layout/TopBar'
import Navbar from '@/components/layout/Navbar'
import { getNavbarCategories } from '@/libs/serverStorefront'

export const metadata = buildPageMetadata({ title: 'By Brand', description: 'Browse the By Brand page on AF Home.', path: '/by-brand' })

export default async function ByBrandPage() {
  const navbarCategories = await getNavbarCategories()

  return (
    <>
      <TopBar />
      <Navbar initialCategories={navbarCategories} />
      <ByBrandPageMain />
    </>
  )
}
