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
import usePageMeta from '../hooks/usePageMeta'

// ─── HomePage ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  usePageMeta('Built for the Street', 'MK 1974 — Premium tracksuits, jerseys and street-ready clothing. Shop the latest collection.')
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
