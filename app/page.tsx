import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import TopBar from "@/components/layout/TopBar";
import TrustBar from "@/components/layout/TrustBar";
import FeaturedSections from "@/components/sections/FeaturedSections";
import HeroSection from "@/components/sections/HeroSection";
import NewsLetter from "@/components/sections/NewsLetter";
import PromoBenners from "@/components/sections/PromoBenners";

export default function Home() {
  return (
    <div>
      <TopBar />
      <Navbar />
      <TrustBar />
      <HeroSection />
      <FeaturedSections />
      <PromoBenners />
      <NewsLetter />
      <Footer />
    </div>
  );
}
