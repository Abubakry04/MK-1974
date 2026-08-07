import Nav from '../components/Nav'
import Footer from '../components/Footer'
import HeroSection from '../components/home/HeroSection'
import FeaturedCategories from '../components/home/FeaturedCategories'
import BrandStrip from '../components/home/BrandStrip'
import NewArrivals from '../components/home/NewArrivals'
import BestSellers from '../components/home/BestSellers'
import Testimonials from '../components/home/Testimonials'
import Newsletter from '../components/home/Newsletter'
import usePageMeta from '../hooks/usePageMeta'

export default function HomePage() {
  usePageMeta('MK 1974 — New Lagos Streetwear Brand', 'MK 1974 is a brand new Lagos streetwear label. Premium jerseys, tracksuits and street-ready clothing. Launched August 11, 2026.')
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <BrandStrip />
        <FeaturedCategories />
        <NewArrivals />
        <BestSellers />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
