import Nav from '../components/Nav'
import Collection from '../components/Collection'
import Signup from '../components/Signup'
import Footer from '../components/Footer'

export default function CollectionPage() {
  return (
    <>
      <Nav />
      {/* Editorial page header */}
      <div className="pt-[68px] bg-dark border-b border-white/[0.05]">
        <div className="max-w-[1440px] mx-auto px-8 md:px-12 py-20 md:py-28 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">SS 2025</p>
            <h1 className="font-playfair font-black italic text-cream" style={{ fontSize: 'clamp(3rem,7vw,6rem)' }}>
              The Collection
            </h1>
          </div>
          <p className="text-muted text-[0.82rem] font-light leading-[1.8] max-w-[300px] md:text-right">
            Premium tracksuits, joggers &amp; performance fleece —<br />
            built for the street.
          </p>
        </div>
      </div>
      <Collection />
      <Signup />
      <Footer />
    </>
  )
}
