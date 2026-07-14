import Nav from '../components/Nav'
import Footer from '../components/Footer'
import HeroSection from '../components/home/HeroSection'
import FeaturedCategories from '../components/home/FeaturedCategories'
import NewArrivals from '../components/home/NewArrivals'
import BestSellers from '../components/home/BestSellers'
import BrandStrip from '../components/home/BrandStrip'
import Testimonials from '../components/home/Testimonials'
import Newsletter from '../components/home/Newsletter'
import SocialGallery from '../components/home/SocialGallery'

import FlashSale from '../components/home/FlashSale'

// ─── HomePage ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <FlashSale />
        <FeaturedCategories />
        <BrandStrip />
        <NewArrivals />
        <BestSellers />
        <Testimonials />
        <Newsletter />
        <SocialGallery />
      </main>
      <Footer />
    </>
  )
}
