import Nav from '../components/Nav'
import Footer from '../components/Footer'
import usePageMeta from '../hooks/usePageMeta'
import { Link } from 'react-router-dom'

export default function AboutPage() {
  usePageMeta('About — MK 1974', 'MK 1974 is a new Lagos streetwear brand built for movement, culture, and real life.')

  const values = [
    { title: 'Quality', desc: 'Every garment is cut from heavy-weight premium fabrics chosen to move, hold shape, and last.' },
    { title: 'Authenticity', desc: 'Rooted in Lagos street culture — our designs are honest, direct, and built for real people.' },
    { title: 'Boldness', desc: 'We launched with a point of view. Every piece reflects a decision, not a trend.' },
    { title: 'Durability', desc: 'We over-engineer every seam and stitch so our pieces outlast the hype.' },
  ]

  return (
    <>
      <Nav />
      <main className="bg-surface min-h-screen">
        {/* Page header */}
        <div className="pt-[70px]">
          <div className="relative h-[55vh] min-h-[360px] overflow-hidden">
            <img
              src="/product3.png"
              alt="About MK 1974"
              className="absolute inset-0 w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-8 md:px-12 pb-12 max-w-[1440px] mx-auto">
              <p className="text-xs text-cream/50 uppercase tracking-widest mb-2">Lagos, Nigeria · 2026</p>
              <h1 className="font-playfair italic font-black text-cream text-4xl md:text-6xl">Our Story</h1>
            </div>
          </div>
        </div>

        {/* Story section */}
        <section className="px-8 md:px-12 py-16">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-dark mb-5">
                Built for movement, made for life.
              </h2>
              <div className="space-y-4 text-dark/70 text-[0.95rem] leading-relaxed">
                <p>MK 1974 is a new Lagos streetwear brand built on one simple belief — that how you dress should never slow you down. The name is ours. The number is part of the identity, not a date.</p>
                <p>We built this brand from scratch, with no shortcuts. Every silhouette, every fabric choice, every detail was deliberate. We wanted to create pieces that feel premium from the first wear and still hold up months later.</p>
                <p>We officially launched on August 11, 2026 — and everything from here is intentional. MK 1974 is for people who move through the city with purpose and dress like it.</p>
              </div>
              <Link to="/shop" className="btn-primary mt-8 inline-flex">Shop the collection</Link>
            </div>
            <div className="aspect-[4/5] overflow-hidden rounded">
              <img src="/product2.png" alt="MK 1974" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* Mission + Vision */}
        <section className="bg-dark px-8 md:px-12 py-16">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-white/10 p-10">
              <p className="text-xs uppercase tracking-widest text-accent mb-4">Mission</p>
              <h3 className="font-playfair italic font-bold text-cream text-2xl mb-4">Dress to move.</h3>
              <p className="text-cream/50 text-sm leading-relaxed">
                To design and deliver premium streetwear that fits the pace of real life — on the street, in the gym, or wherever you carry yourself. Clothing that works as hard as you do.
              </p>
            </div>
            <div className="border border-white/10 p-10">
              <p className="text-xs uppercase tracking-widest text-accent mb-4">Vision</p>
              <h3 className="font-playfair italic font-bold text-cream text-2xl mb-4">Build something that lasts.</h3>
              <p className="text-cream/50 text-sm leading-relaxed">
                To become the defining Lagos streetwear brand — known not for hype, but for quality, consistency, and a clear identity. We are just getting started.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="px-8 md:px-12 py-16 bg-surface2">
          <div className="max-w-[1440px] mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-10">What we stand for</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <div key={v.title} className="border-t-2 border-accent pt-5">
                  <p className="text-xs text-muted mb-2">0{i + 1}</p>
                  <h3 className="font-bold text-dark text-lg mb-2">{v.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
