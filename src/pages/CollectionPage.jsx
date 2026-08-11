import Nav from '../components/Nav'
import Collection from '../components/Collection'
import Signup from '../components/Signup'
import Footer from '../components/Footer'

export default function CollectionPage() {
  return (
    <>
      <Nav />
      {/* Editorial page header */}
      <div className="pt-[68px] bg-surface border-b border-black/10 text-dark">
        <div className="max-w-[1440px] mx-auto px-8 md:px-12 py-20 md:py-28 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">SS 2025</p>
            <h1 className="font-playfair font-black italic text-dark" style={{ fontSize: 'clamp(3rem,7vw,6rem)' }}>
              The Collection
            </h1>
          </div>
          <p className="text-dark/60 text-[0.82rem] font-medium leading-[1.8] max-w-[300px] md:text-right">
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
