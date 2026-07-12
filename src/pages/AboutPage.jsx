import Nav from '../components/Nav'
import Footer from '../components/Footer'
import model from '../assets/mk.png'

export default function AboutPage() {
  const team = [
    { name: 'Mohammed K.', role: 'Founder & Creative Director', bio: 'Born in 1974, Mohammed built MK from a passion for athletic excellence and street culture.' },
    { name: 'Aisha D.', role: 'Head of Design', bio: 'With 12 years at leading sportswear labels, Aisha brings precision and artistry to every piece.' },
    { name: 'Tariq N.', role: 'Head of Production', bio: 'Tariq oversees our ethical manufacturing partnerships and quality assurance processes.' },
  ]

  const values = [
    { title: 'Quality First', icon: '⭐', desc: 'Every garment is crafted from premium fabrics engineered for performance and longevity.' },
    { title: 'Street Authentic', icon: '🏙️', desc: 'Rooted in urban culture, our designs speak to the streets while elevating the everyday.' },
    { title: 'Sustainably Made', icon: '🌱', desc: 'We partner with ethical manufacturers and increasingly use recycled and organic materials.' },
    { title: 'Community Driven', icon: '🤝', desc: 'Our customers are our community. Every design is born from real-world feedback and lived experience.' },
  ]

  return (
    <>
      <Nav />
      <main className="bg-surface2 min-h-screen">
        {/* Hero */}
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <img src={model} alt="About MK 1974" className="absolute inset-0 w-full h-full object-cover opacity-50" style={{ filter: 'sepia(0.25) brightness(0.85) contrast(1.1)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-8 md:px-12 pb-16">
            <div className="max-w-[1440px] mx-auto">
              <p className="eyebrow mb-4">Est. 1974</p>
              <h1 className="font-playfair font-black italic text-cream" style={{ fontSize: 'clamp(3rem,7vw,6rem)' }}>Our Story</h1>
            </div>
          </div>
        </section>

        {/* Story — dark bg, cream text ✓ */}
        <section className="bg-surface2 px-8 md:px-12 py-20">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="eyebrow mb-4">How It Started</p>
              <h2 className="font-playfair font-black italic text-black text-4xl mb-6">Built for Movement, Made for Life.</h2>
              <div className="space-y-4 text-black text-[0.92rem] font-light leading-[1.9]">
                <p>MK 1974 was born from a single conviction: that athletic wear should never compromise between performance and style. Founded by Mohammed K. in the back streets of Manchester, the brand began as a small run of hand-sewn tracksuits for local athletes who refused to choose between looking sharp and moving freely.</p>
                <p>Today, MK 1974 is worn by athletes, creatives, and street culture enthusiasts across the UK and beyond. But the ethos remains the same — every thread, every stitch, every silhouette is engineered for the person who demands both.</p>
                <p>Our name is a tribute to the year that movement became culture, when sport stepped off the track and onto the streets for good.</p>
              </div>
            </div>
            <div className="aspect-[4/5] overflow-hidden">
              <img src="/product2.png" alt="MK 1974 Story" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* Mission / Vision — light surface cards on dark page */}
        <section className="bg-surface2 px-8 md:px-12 py-20">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-dark border border-white/[0.06] p-10">
              <p className="eyebrow mb-4">Mission</p>
              <h3 className="font-playfair font-black italic text-cream text-3xl mb-5">To empower movement.</h3>
              <p className="text-cream/60 text-[0.9rem] font-light leading-[1.9]">
                To create athletic wear that empowers every individual to move with confidence — on the track, in the gym, or on the street. We believe great clothing should be a tool for self-expression, not a barrier to performance.
              </p>
            </div>
            <div className="bg-dark border border-white/[0.06] p-10">
              <p className="eyebrow mb-4">Vision</p>
              <h3 className="font-playfair font-black italic text-cream text-3xl mb-5">A world in motion.</h3>
              <p className="text-cream/60 text-[0.9rem] font-light leading-[1.9]">
                To be the go-to premium streetwear and activewear brand for a generation that lives and breathes movement. We envision a world where quality athletic wear is accessible, sustainable, and unapologetically bold.
              </p>
            </div>
          </div>
        </section>

        {/* Values — dark bg section, light surface cards */}
        <section className="bg-surface2 px-8 md:px-12 py-20">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-14">
              <p className="eyebrow mb-4">What We Stand For</p>
              <h2 className="font-playfair font-black italic text-4xl" style={{ color: '#1A1A1A' }}>Our Values</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map(v => (
                <div key={v.title} className="bg-surface2 border border-black/[0.08] p-8 text-center">
                  <div className="text-4xl mb-4">{v.icon}</div>
                  <h3 className="font-semibold text-[0.85rem] tracking-[0.2em] uppercase mb-3" style={{ color: '#1A1A1A' }}>{v.title}</h3>
                  <p className="text-muted text-[0.82rem] font-light leading-[1.7]">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team — light surface section with dark cards */}
        <section className="bg-surface2 px-8 md:px-12 py-20">
          <div className="max-w-[1440px] mx-auto">
            <div className="text-center mb-14">
              <p className="eyebrow mb-4">The People</p>
              <h2 className="font-playfair font-black italic text-4xl" style={{ color: '#1A1A1A' }}>Meet the Brand</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map(member => (
                <div key={member.name} className="bg-dark border border-white/[0.06] p-8 text-center">
                  <div className="w-16 h-16 bg-lime flex items-center justify-center text-white font-black text-2xl mx-auto mb-5">
                    {member.name[0]}
                  </div>
                  <h3 className="text-cream font-semibold text-[0.9rem] mb-1">{member.name}</h3>
                  <p className="text-lime text-[0.65rem] tracking-[0.2em] uppercase mb-4">{member.role}</p>
                  <p className="text-muted text-[0.8rem] font-light leading-[1.7]">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats — dark bg */}
        {/* <section className="bg-dark px-8 md:px-12 py-16 border-t border-white/[0.05]">
          <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50+', label: 'Countries Shipped To' },
              { value: '25K+', label: 'Happy Customers' },
              { value: '4.8★', label: 'Average Rating' },
              { value: '50 Years', label: 'Of Street Heritage' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="font-playfair font-black italic text-lime text-4xl mb-2">{stat.value}</p>
                <p className="text-muted text-[0.72rem] tracking-[0.2em] uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </section> */}
      </main>
      <Footer />
    </>
  )
}
