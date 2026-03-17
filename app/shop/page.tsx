import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Shop', description: 'Browse the Shop page on AF Home.', path: '/shop' });

import Footer from "@/components/layout/Footer"
import Navbar from "@/components/layout/Navbar"
import TopBar from "@/components/layout/TopBar"
import TrustBar from "@/components/layout/TrustBar"
import ShopBuilderSections from "@/components/sections/ShopBuilderSections"

const ShopPage = () => {
  return (
    <div>
      <TopBar />
      <Navbar />
      <TrustBar />
      <ShopBuilderSections />
      <Footer />
    </div>
  )
}

export default ShopPage
